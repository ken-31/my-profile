import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 宇宙空間のパーティクル（シアン／パープル／ブルーの星々）
const Stars: React.FC<{ count?: number }> = ({ count = 2200 }) => {
    const ref = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const palette = [
            new THREE.Color('#22d3ee'),
            new THREE.Color('#a855f7'),
            new THREE.Color('#60a5fa'),
            new THREE.Color('#e0f2fe'),
        ];
        for (let i = 0; i < count; i++) {
            const r = 12 + Math.random() * 28;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return [pos, col];
    }, [count]);

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y += delta * 0.015;
        ref.current.rotation.x += delta * 0.004;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.07}
                vertexColors
                transparent
                opacity={0.85}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// マウスパララックス：ポインタ位置に合わせてカメラをゆっくり追従させる
const ParallaxRig: React.FC = () => {
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    useFrame((state) => {
        const cam = state.camera;
        cam.position.x += (target.current.x * 0.9 - cam.position.x) * 0.04;
        cam.position.y += (target.current.y * 0.6 - cam.position.y) * 0.04;
        cam.lookAt(0, 0, 0);
    });

    return null;
};

// 固定背景：Three.js の宇宙 + CSS の光ストリーク／グリッド／スキャンライン
const HoloBackground: React.FC = () => (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Canvas camera={{ position: [0, 0, 9], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
            <Stars />
            <ParallaxRig />
        </Canvas>

        {/* 光のストリーク */}
        <div className="absolute inset-0">
            <div className="light-streak" style={{ top: '8%', left: '-10%', animationDelay: '0s' }}></div>
            <div className="light-streak purple" style={{ top: '35%', left: '-25%', animationDelay: '3.2s' }}></div>
            <div className="light-streak" style={{ top: '62%', left: '-18%', animationDelay: '6.1s' }}></div>
        </div>

        {/* パースペクティブ・グリッドフロア */}
        <div className="holo-grid"></div>

        {/* スキャンライン */}
        <div className="scanlines"></div>
    </div>
);

export default HoloBackground;
