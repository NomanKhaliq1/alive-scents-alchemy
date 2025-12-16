
import Link from 'next/link';

export function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {

    const base = "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const styles = {
        primary: "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-black/5 hover:opacity-90 dark:shadow-white/5",
        secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]",
        ghost: "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
    };

    return (
        <button className={`${base} ${styles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
