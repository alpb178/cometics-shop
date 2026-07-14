// Skeleton del carrito: refleja el layout real de `components/cart/cart-page.tsx`
// (sección ancha `max-w-screen-2xl`, grid `[1fr_400px]` con aside de resumen,
// imágenes en retrato `aspect-[3/4]` y filas divididas sin borde) para que no
// haya salto de layout al cargar el contenido real.
export default function CartLoading() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl animate-pulse px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="h-3 w-20 bg-muted" />
          <div className="mt-3 h-9 w-56 bg-muted" />
        </div>
        <div className="h-4 w-28 bg-muted" />
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <ul className="divide-y divide-border border-y border-border">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex gap-5 py-6">
              <div className="aspect-[3/4] w-24 shrink-0 bg-muted sm:w-32" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-4 w-2/5 bg-muted" />
                  <div className="h-8 w-8 shrink-0 bg-muted" />
                </div>
                <div className="mt-2 h-3 w-24 bg-muted" />
                <div className="mt-4 h-4 w-20 bg-muted" />
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="h-9 w-28 bg-muted" />
                  <div className="h-4 w-16 bg-muted" />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="border border-border p-6">
            <div className="h-3 w-24 bg-muted" />
            <div className="mt-6 space-y-4 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-muted" />
                <div className="h-4 w-16 bg-muted" />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="h-5 w-16 bg-muted" />
                <div className="h-5 w-20 bg-muted" />
              </div>
            </div>
            <div className="mt-6 h-12 w-full bg-muted" />
            <div className="mt-4 h-3 w-3/4 bg-muted" />
          </div>
        </aside>
      </div>
    </section>
  );
}
