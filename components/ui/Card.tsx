
export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
            {children}
        </div>
    )
}
