// Order detail skeleton: this is the screen checkout redirects to after the
// payment is confirmed (`router.push("/account/orders/{id}")`). It didn't exist
// before, and the transition stayed blank while the server component loaded.
// Mirrors the layout of `page.tsx` (`max-w-3xl` section, header with status,
// product list, delivery/payment blocks and totals).
export default function OrderDetailLoading() {
  return (
    <section className="mx-auto w-full max-w-3xl animate-pulse px-6 py-16 lg:py-24">
      <div className="h-3 w-32 bg-muted" />

      <header className="mb-10 mt-6 border-b border-border pb-6">
        <div className="h-3 w-24 bg-muted" />
        <div className="mt-3 h-9 w-64 bg-muted" />
        <div className="mt-3 h-4 w-40 bg-muted" />
      </header>

      <div className="space-y-10">
        <div>
          <div className="mb-4 h-3 w-24 bg-muted" />
          <ul className="divide-y divide-border border-y border-border">
            {[0, 1].map((i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted" />
                    <div className="h-3 w-24 bg-muted" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted" />
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <div className="mb-3 h-3 w-20 bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted" />
              <div className="h-3 w-48 bg-muted" />
              <div className="h-3 w-40 bg-muted" />
            </div>
          </div>
          <div>
            <div className="mb-3 h-3 w-16 bg-muted" />
            <div className="h-4 w-28 bg-muted" />
            <div className="mt-3 h-32 w-32 bg-muted" />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-muted" />
              <div className="h-4 w-16 bg-muted" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-muted" />
              <div className="h-4 w-16 bg-muted" />
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <div className="h-5 w-16 bg-muted" />
              <div className="h-5 w-20 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
