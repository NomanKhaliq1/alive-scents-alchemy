
export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`border border-gray-200 rounded-lg p-6 shadow-sm bg-white ${className}`}>
            {children}
        </div>
    )
}
