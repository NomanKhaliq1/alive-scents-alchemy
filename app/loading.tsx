
import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
    return (
        <div className="w-full space-y-8 p-6 md:p-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Grid/Content Skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
        </div>
    )
}
