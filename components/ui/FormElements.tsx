
export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${className}`}
            {...props}
        />
    )
}

export function Select({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select
                className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--foreground)] ${className}`}
                {...props}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)]">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1L5 5L9 1" />
                </svg>
            </div>
        </div>
    )
}
