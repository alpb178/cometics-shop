import { Skeleton } from "./Skeleton";

export function HowItWorksSkeleton() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-4">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-10 md:h-12 w-72 md:w-96" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        {/* Step cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              {/* Icon box + badge */}
              <div className="relative w-14 h-14">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton
                  className="absolute -top-2 -right-2 w-7 h-7"
                  variant="circular"
                />
              </div>

              {/* Title */}
              <Skeleton className="h-6 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
