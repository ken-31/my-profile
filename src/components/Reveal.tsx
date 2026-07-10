import { motion } from 'framer-motion';

type RevealVariant = 'up' | 'fade' | 'scale' | 'blur';

const variantMap = {
    up: {
        hidden: { opacity: 0, y: 64, scale: 0.97, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    },
    fade: {
        hidden: { opacity: 0, filter: 'blur(6px)' },
        show: { opacity: 1, filter: 'blur(0px)' },
    },
    scale: {
        hidden: { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
        show: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    },
    blur: {
        hidden: { opacity: 0, y: 24, filter: 'blur(14px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
} as const;

// スクロールで画面に入ったときにスプリングで出現させるラッパー
const Reveal: React.FC<{
    children: React.ReactNode;
    variant?: RevealVariant;
    delay?: number;
    className?: string;
}> = ({ children, variant = 'up', delay = 0, className = 'w-full' }) => (
    <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={variantMap[variant]}
        transition={{
            type: 'spring',
            stiffness: 60,
            damping: 16,
            mass: 0.9,
            delay,
            filter: { duration: 0.9, ease: 'easeOut', delay },
        }}
    >
        {children}
    </motion.div>
);

export default Reveal;
