
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass'
}

export function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}: ButtonProps) {

    const variants = {
        primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 border border-violet-500/50",
        secondary: "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--border)]",
        ghost: "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5",
        danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40",
        glass: "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                className
            )}
            {...props as any}
        >
            {children}
        </motion.button>
    );
}
