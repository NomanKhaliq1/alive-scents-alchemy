
import { cn } from '@/lib/utils'

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm transition-all outline-none",
                "focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20",
                "placeholder:text-white/20 text-[var(--foreground)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        />
    )
}

export function Select({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none transition-all outline-none",
                    "focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20",
                    "text-[var(--foreground)] cursor-pointer",
                    // Dark mode option handling
                    "[&>option]:bg-[#0f1021] [&>option]:text-white",
                    className
                )}
                {...props}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1L5 5L9 1" />
                </svg>
            </div>
        </div>
    )
}
