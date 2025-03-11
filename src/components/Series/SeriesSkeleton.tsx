import { Skeleton } from "../ui/skeleton"

const SeriesSkeleton = () => {
    return (
        <div className="overflow-hidden relative flex flex-col min-w-0 break-words h-[260px] sm:h-[360px] md:h-[260px] lg:h-[220px] xl:h-[280px] 2xl:h-[320px] mb-[5px] rounded-[5px]">
            <div className="h-full object-fill object-[center_top] absolute w-full z-0 transition-all duration-[0.2s] ease-[ease-in-out] delay-[0s] rounded-[5px] hover:scale-110">
                <Skeleton className="w-[640px] h-[960px]" />
            </div>
        </div>
    )
}

export default SeriesSkeleton;