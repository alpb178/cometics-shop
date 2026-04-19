import { Skeleton } from "./Skeleton";

export function ContactSkeleton() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-4">
          <Skeleton className="h-7 w-48 rounded-full" />
          <Skeleton className="h-10 md:h-12 w-72 md:w-96" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Form card */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-11 h-11 rounded-2xl" />
              <Skeleton className="h-7 w-56" />
            </div>

            <div className="space-y-5">
              {/* Text inputs */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
              {/* Textarea */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              {/* Submit */}
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Socials */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
              <Skeleton className="h-4 w-48" />
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-11 h-11" variant="circular" />
                ))}
              </div>
            </div>
          </div>

          {/* Info + map */}
          <div className="lg:col-span-2 space-y-4">
            {/* WhatsApp card */}
            <div className="flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Address card */}
            <div className="flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Map */}
            <Skeleton className="h-64 md:h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
