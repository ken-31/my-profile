import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// マウス位置に追従して 3D チルトするホログラフィック・パネル
const TiltCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    max?: number; // 最大チルト角（deg）
}> = ({ children, className, max = 7 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const springRx = useSpring(rx, { stiffness: 130, damping: 14, mass: 0.6 });
    const springRy = useSpring(ry, { stiffness: 130, damping: 14, mass: 0.6 });

    const handleMove = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * max);
        rx.set(-py * max);
    };

    const handleLeave = () => {
        rx.set(0);
        ry.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ rotateX: springRx, rotateY: springRy, transformPerspective: 900, transformStyle: 'preserve-3d' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default TiltCard;
