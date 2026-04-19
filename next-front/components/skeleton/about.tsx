import { Skeleton } from "./Skeleton";

export function AboutSkeleton() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-32">
        {[0, 1, 2].map((index) => {
          const imageFirst = index % 2 === 0;
          return (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Image placeholder */}
              <div
                className={`relative ${
                  imageFirst ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <Skeleton className="w-full aspect-[16/10] rounded-3xl" />
              </div>

              {/* Text placeholder */}
              <div
                className={`space-y-4 ${
                  imageFirst ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 md:h-12 w-3/4" />
                <Skeleton className="h-1 w-16 rounded-full" />
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
