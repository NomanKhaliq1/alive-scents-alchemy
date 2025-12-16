
import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse w-full max-w-7xl mx-auto">

            {/* Header Skeleton */}
            <div className="space-y-4 text-center py-12">
                <div className="h-12 w-3/4 mx-auto bg-violet-500/10 rounded-xl" />
                <div className="h-6 w-1/2 mx-auto bg-violet-500/5 rounded-lg" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm p-6 space-y-4">
                        <div className="h-10 w-10 rounded-lg bg-white/10" />
                        <div className="h-6 w-3/4 bg-white/10 rounded" />
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-2/3 bg-white/5 rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
