import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpiralScene, { sectionViewProgress, DEPTH } from './SpiralScene';
import { sections } from './sections';
import './museum.css';

gsap.registerPlugin(ScrollTrigger);

// 進行度から「現在のフロア」を求める（まだ最初の展示前なら -1）
const floorIndexFor = (p: number): number => {
    let idx = -1;
    for (let i = 0; i < sections.length; i++) {
        if (p >= sectionViewProgress(i) - 0.045) idx = i;
    }
    return idx;
};

const MuseumExperience: React.FC = () => {
    const progressRef = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const depthBarRef = useRef<HTMLDivElement>(null);
    const depthTextRef = useRef<HTMLSpanElement>(null);
    const [floor, setFloor] = useState(-1);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const st = ScrollTrigger.create({
            trigger: trackRef.current,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                progressRef.current = self.progress;
                if (depthBarRef.current) depthBarRef.current.style.transform = `scaleX(${self.progress})`;
                if (depthTextRef.current) depthTextRef.current.textContent = `-${(self.progress * DEPTH).toFixed(1)}m`;
                setFloor(floorIndexFor(self.progress));
                setStarted(self.progress > 0.012);
            },
        });
        return () => st.kill();
    }, []);

    const current = floor >= 0 ? sections[floor] : null;

    return (
        <div className="museum-root">
            {/* 3D空間（固定表示・スクロールはカメラ移動に変換） */}
            <div className="museum-canvas">
                <Canvas
                    shadows
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, powerPreference: 'high-performance' }}
                    camera={{ fov: 60, near: 0.1, far: 70, position: [5, 1.75, 0] }}
                >
                    <SpiralScene progressRef={progressRef} />
                </Canvas>
            </div>

            {/* HUD オーバーレイ */}
            <div className="museum-hud">
                <motion.div
                    className="hud-brand"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.4 }}
                >
                    MOCHIZUKI <span>/</span> SPIRAL MUSEUM
                </motion.div>

                {/* フロアインジケータ */}
                <div className="hud-floors">
                    {sections.map((s, i) => (
                        <div key={s.id} className={`hud-floor ${i === floor ? 'active' : ''}`}>
                            <span>{s.index}</span>
                            <span className="dot"></span>
                        </div>
                    ))}
                </div>

                {/* 現在のセクション名 */}
                <AnimatePresence mode="wait">
                    {current && (
                        <motion.div
                            key={current.id}
                            className="hud-section-title"
                            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                            transition={{ type: 'spring', stiffness: 70, damping: 16 }}
                        >
                            <div className="idx">FLOOR {current.index}</div>
                            <div className="name">{current.title}</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 降下深度メーター */}
                <div className="hud-depth">
                    DEPTH <span ref={depthTextRef}>-0.0m</span>
                    <div className="bar"><div ref={depthBarRef} style={{ transform: 'scaleX(0)' }}></div></div>
                </div>

                {/* スクロールヒント（開始前のみ） */}
                <AnimatePresence>
                    {!started && (
                        <motion.div
                            className="hud-scroll-hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            SCROLL TO DESCEND
                            <div className="arrow"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* スクロール距離を生む透明トラック */}
            <div ref={trackRef} className="museum-track"></div>
        </div>
    );
};

export default MuseumExperience;
