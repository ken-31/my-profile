import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { sections } from './sections';
import type { MuseumSection } from './sections';

// ============ 螺旋のパラメータ ============
export const TURNS = 3.25;          // 総回転数
export const DEPTH = 66;            // 降下する深さ
export const RADIUS = 5.7;          // カメラが辿る螺旋の半径（階段の外側を滑空する位置）
const STEP_COUNT = 190;             // 階段の段数

// 進行度 p (0..1) → 螺旋上の座標
const spiralAngle = (p: number) => p * TURNS * Math.PI * 2;
const spiralPos = (p: number, radius: number, out = new THREE.Vector3()) => {
    const a = spiralAngle(p);
    return out.set(Math.cos(a) * radius, -p * DEPTH, Math.sin(a) * radius);
};

// 各セクションが展示される進行度（最終セクションはスクロール終端でちょうど正面に来る）
export const sectionProgress = (i: number) => 0.08 + i * (0.975 / (sections.length - 1));
// そのセクションが最も良く見えるカメラ進行度
export const sectionViewProgress = (i: number) => sectionProgress(i) - 0.055;

// ============ カメラリグ：スクロールで螺旋降下＋マウス視差 ============
const CameraRig: React.FC<{
    progressRef: React.MutableRefObject<number>;
    smoothRef: React.MutableRefObject<number>;
}> = ({ progressRef, smoothRef }) => {
    const smooth = smoothRef;
    const mouse = useRef({ x: 0, y: 0 });
    const lookTarget = useMemo(() => new THREE.Vector3(), []);
    const lightRef = useRef<THREE.PointLight>(null);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    useFrame((state, delta) => {
        // シネマティックな遅れを持たせたスムージング
        smooth.current = THREE.MathUtils.damp(smooth.current, progressRef.current, 2.4, delta);
        const p = smooth.current;
        const cam = state.camera;

        spiralPos(p, RADIUS, cam.position);
        cam.position.y += 1.75;

        // 少し先（降下方向）の内側を見る
        const ahead = p + 0.055;
        spiralPos(ahead, 1.9, lookTarget);
        lookTarget.y += 1.6;
        lookTarget.y = Math.max(lookTarget.y, -DEPTH + 1.7); // 最下層より下は見ない
        lookTarget.x += mouse.current.x * 0.9;
        lookTarget.y += mouse.current.y * 0.6;
        cam.lookAt(lookTarget);

        // カメラ随伴ライト（館内照明）
        if (lightRef.current) {
            lightRef.current.position.copy(cam.position);
            lightRef.current.position.y += 1.5;
        }
    });

    return <pointLight ref={lightRef} intensity={13} distance={12} decay={2} color="#f4f4f5" />;
};

// ============ モノクロ建築：螺旋階段＋中央柱＋外壁＋手すり ============
const Architecture: React.FC = () => {
    const stepsRef = useRef<THREE.InstancedMesh>(null);

    useLayoutEffect(() => {
        const mesh = stepsRef.current;
        if (!mesh) return;
        const o = new THREE.Object3D();
        for (let i = 0; i < STEP_COUNT; i++) {
            const p = i / STEP_COUNT;
            const a = spiralAngle(p);
            o.position.set(Math.cos(a) * 3.1, -p * DEPTH, Math.sin(a) * 3.1);
            o.rotation.set(0, -a, 0);
            o.updateMatrix();
            mesh.setMatrixAt(i, o.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
    }, []);

    // 手すり（外側・内側）のチューブ
    const [outerRail, innerRail] = useMemo(() => {
        const make = (radius: number, lift: number) => {
            const pts: THREE.Vector3[] = [];
            for (let i = 0; i <= 220; i++) {
                const p = i / 220;
                const v = spiralPos(p, radius);
                v.y += lift;
                pts.push(v);
            }
            return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 420, 0.045, 8, false);
        };
        return [make(4.85, 1.05), make(1.42, 1.0)];
    }, []);

    return (
        <group>
            {/* 階段（インスタンシング） */}
            <instancedMesh ref={stepsRef} args={[undefined, undefined, STEP_COUNT]} castShadow receiveShadow>
                <boxGeometry args={[3.6, 0.13, 0.62]} />
                <meshStandardMaterial color="#d4d4d4" roughness={0.55} metalness={0.08} />
            </instancedMesh>

            {/* 中央の柱（磨かれた黒） */}
            <mesh position={[0, -DEPTH / 2, 0]}>
                <cylinderGeometry args={[1.1, 1.1, DEPTH + 40, 48]} />
                <meshStandardMaterial color="#141414" roughness={0.25} metalness={0.75} />
            </mesh>

            {/* 外壁（漆黒の円筒・内側向き） */}
            <mesh position={[0, -DEPTH / 2, 0]}>
                <cylinderGeometry args={[9.5, 9.5, DEPTH + 40, 64, 1, true]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} side={THREE.BackSide} />
            </mesh>

            {/* 外壁の白い縦光条（美術館の照明） */}
            {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return (
                    <mesh key={i} position={[Math.cos(a) * 9.3, -DEPTH / 2, Math.sin(a) * 9.3]} rotation={[0, -a + Math.PI / 2, 0]}>
                        <boxGeometry args={[0.06, DEPTH + 36, 0.02]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.1} toneMapped={false} />
                    </mesh>
                );
            })}

            {/* 手すり：外側（白発光）／内側 */}
            <mesh geometry={outerRail}>
                <meshStandardMaterial color="#f5f5f5" emissive="#dddddd" emissiveIntensity={0.35} roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh geometry={innerRail}>
                <meshStandardMaterial color="#e5e5e5" emissive="#cccccc" emissiveIntensity={0.25} roughness={0.3} metalness={0.4} />
            </mesh>

            {/* 最下層の床 */}
            <mesh position={[0, -DEPTH - 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[9.5, 64]} />
                <meshStandardMaterial color="#101010" roughness={0.2} metalness={0.6} />
            </mesh>
        </group>
    );
};

// ============ 漂う光の粒子 ============
const DustParticles: React.FC<{ count?: number }> = ({ count = 700 }) => {
    const ref = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const palette = [new THREE.Color('#7defff'), new THREE.Color('#c084fc'), new THREE.Color('#93c5fd'), new THREE.Color('#f8fafc')];
        for (let i = 0; i < count; i++) {
            const r = 1.5 + Math.random() * 7.5;
            const a = Math.random() * Math.PI * 2;
            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 1] = -Math.random() * (DEPTH + 10) + 4;
            pos[i * 3 + 2] = Math.sin(a) * r;
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        return [pos, col];
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

// ============ 虹色に反射する浮遊オーブ ============
const IridescentOrbs: React.FC = () => {
    const group = useRef<THREE.Group>(null);
    const orbs = useMemo(() => (
        [0.22, 0.5, 0.8].map((p, i) => ({
            base: spiralPos(p, 6.8),
            phase: i * 2.1,
            size: 0.5 + i * 0.15,
        }))
    ), []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        group.current?.children.forEach((child, i) => {
            const o = orbs[i];
            child.position.y = o.base.y + Math.sin(t * 0.5 + o.phase) * 0.6;
            child.rotation.y = t * 0.3 + o.phase;
        });
    });

    return (
        <group ref={group}>
            {orbs.map((o, i) => (
                <mesh key={i} position={o.base}>
                    <sphereGeometry args={[o.size, 48, 48]} />
                    <meshPhysicalMaterial
                        color="#e5e7eb"
                        roughness={0.08}
                        metalness={0.2}
                        clearcoat={1}
                        iridescence={1}
                        iridescenceIOR={1.6}
                        iridescenceThicknessRange={[120, 700]}
                    />
                </mesh>
            ))}
        </group>
    );
};

// ============ ホログラム投影シェーダー（走査線＋ちらつき） ============
const holoVertex = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const holoFragment = /* glsl */ `
    uniform float uTime;
    uniform float uVis;
    varying vec2 vUv;
    void main() {
        vec3 cyan = vec3(0.35, 0.95, 1.0);
        vec3 violet = vec3(0.72, 0.45, 1.0);
        vec3 col = mix(cyan, violet, vUv.y);
        float scan = 0.72 + 0.28 * sin(vUv.y * 90.0 - uTime * 7.0);
        float flicker = 0.9 + 0.1 * sin(uTime * 23.0) * sin(uTime * 7.3);
        float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x)
                   * smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
        gl_FragColor = vec4(col, 0.16 * scan * flicker * edge * uVis);
    }
`;

// ============ セクションのホログラム展示 ============
const Hologram: React.FC<{ section: MuseumSection; index: number; progressRef: React.MutableRefObject<number> }> = ({ section, index, progressRef }) => {
    // progressRef にはカメラと同じスムージング済みの進行度が渡される
    const q = sectionProgress(index);
    const viewP = sectionViewProgress(index);

    const groupRef = useRef<THREE.Group>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const decoRef = useRef<THREE.Mesh>(null);
    const beamMat = useRef<THREE.ShaderMaterial>(null);
    const planeMat = useRef<THREE.ShaderMaterial>(null);

    const position = useMemo(() => {
        const v = spiralPos(q, 2.05);
        v.y += 2.45; // 手すりより上に浮かせる
        v.y = Math.max(v.y, -DEPTH + 2.0); // 最終展示は最下層フロアの上に立つ
        return v;
    }, [q]);

    // 接近してくるカメラの方向へ（垂直は保ったままヨー回転のみ）
    useLayoutEffect(() => {
        const camPos = spiralPos(viewP, RADIUS);
        camPos.y = position.y; // 水平方向だけ向かせてパネルは直立させる
        groupRef.current?.lookAt(camPos);
    }, [viewP, position]);

    const planeUniforms = useMemo(() => ({ uTime: { value: 0 }, uVis: { value: 0 } }), []);
    const beamUniforms = useMemo(() => ({ uTime: { value: 0 }, uVis: { value: 0 } }), []);

    useFrame((state) => {
        const p = progressRef.current;
        const d = p - viewP;
        // 接近で実体化、通過後は素早く暗闇へ（最終展示はフィナーレとして消えない）
        const isLast = index === sections.length - 1;
        const vis = d < 0
            ? Math.max(0, 1 + d / 0.07)
            : isLast ? 1 : Math.max(0, 1 - d / 0.045);
        const eased = vis * vis * (3 - 2 * vis); // smoothstep

        if (panelRef.current) {
            panelRef.current.style.opacity = String(eased);
            panelRef.current.style.visibility = eased < 0.02 ? 'hidden' : 'visible';
        }
        if (lightRef.current) lightRef.current.intensity = eased * 14;
        if (groupRef.current) {
            const s = 0.82 + eased * 0.18;
            groupRef.current.scale.setScalar(s);
        }
        if (decoRef.current) {
            decoRef.current.rotation.y = state.clock.elapsedTime * 0.6;
            decoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
            decoRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.9 + index) * 0.08;
        }
        planeUniforms.uTime.value = state.clock.elapsedTime;
        planeUniforms.uVis.value = eased;
        beamUniforms.uTime.value = state.clock.elapsedTime;
        beamUniforms.uVis.value = eased;
        void beamMat; void planeMat;
    });

    return (
        <group ref={groupRef} position={position}>
            {/* ホログラム投影面（シェーダー） */}
            <mesh position={[0, 0.1, -0.06]}>
                <planeGeometry args={[2.2, 1.55]} />
                <shaderMaterial
                    ref={planeMat}
                    vertexShader={holoVertex}
                    fragmentShader={holoFragment}
                    uniforms={planeUniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* DOMコンテンツ（グラスモーフィズム・パネル） */}
            <Html transform distanceFactor={2.0} position={[0, 0.1, 0]} style={{ pointerEvents: 'none' }}>
                <div ref={panelRef} className="holo-panel" style={{ opacity: 0 }}>
                    <div className="floor-index">FLOOR {section.index}</div>
                    <h2>{section.title}</h2>
                    <div className="subtitle">{section.subtitle}</div>
                    <ul>
                        {section.lines.map((l, i) => (
                            <li key={i}>
                                {l.label && <span className="label">{l.label}</span>}
                                <span>{l.text}</span>
                            </li>
                        ))}
                    </ul>
                    {section.link && (
                        <a href={section.link.url} target="_blank" rel="noopener noreferrer">{section.link.label}</a>
                    )}
                </div>
            </Html>

            {/* パネル上部を漂うワイヤーフレーム装飾 */}
            <mesh ref={decoRef} position={[0, 1.5, 0]}>
                <icosahedronGeometry args={[0.26, 1]} />
                <meshStandardMaterial color="#7defff" emissive="#7defff" emissiveIntensity={2.2} wireframe transparent opacity={0.8} toneMapped={false} />
            </mesh>

            {/* 投影ビーム（下の発光台座から） */}
            <mesh position={[0, -1.5, 0]}>
                <coneGeometry args={[1.2, 1.9, 4, 1, true]} />
                <shaderMaterial
                    ref={beamMat}
                    vertexShader={holoVertex}
                    fragmentShader={holoFragment}
                    uniforms={beamUniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={[0, -2.45, 0]}>
                <cylinderGeometry args={[0.35, 0.42, 0.12, 24]} />
                <meshStandardMaterial color="#111111" emissive="#7defff" emissiveIntensity={1.6} roughness={0.3} metalness={0.6} toneMapped={false} />
            </mesh>

            {/* ホログラムの発光 */}
            <pointLight ref={lightRef} color="#66e5ff" intensity={0} distance={10} decay={2} />
        </group>
    );
};

// ============ シーン全体 ============
const SpiralScene: React.FC<{ progressRef: React.MutableRefObject<number> }> = ({ progressRef }) => {
    // カメラと展示の実体化を同じスムージング済み進行度で同期させる
    const smoothRef = useRef(0);

    return (
    <>
        <color attach="background" args={['#050505']} />
        <fogExp2 attach="fog" args={['#050505', 0.05]} />

        <ambientLight intensity={0.22} />
        <spotLight
            position={[0, 14, 0]}
            angle={0.7}
            penumbra={0.6}
            intensity={120}
            color="#f8fafc"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
        />

        <CameraRig progressRef={progressRef} smoothRef={smoothRef} />
        <Architecture />
        <DustParticles />
        <IridescentOrbs />

        {sections.map((s, i) => (
            <Hologram key={s.id} section={s} index={i} progressRef={smoothRef} />
        ))}

        <EffectComposer multisampling={0}>
            <Bloom intensity={0.7} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />
            <ChromaticAberration offset={[0.0011, 0.0007]} />
            <Vignette eskil={false} offset={0.18} darkness={0.85} />
        </EffectComposer>
    </>
    );
};

export default SpiralScene;
