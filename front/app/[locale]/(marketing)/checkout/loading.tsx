// Skeleton del checkout: refleja el layout real de
// `components/checkout/checkout-form.tsx` (sección `max-w-6xl`, header con
// indicador de 3 pasos y aviso de envío, grid `[1fr_360px]` con el paso 1 —
// tarjetas de método de entrega — y el aside "Tu pedido") para que no haya
// salto de layout al cargar el contenido real.
export default function CheckoutLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl animate-pulse px-6 py-12 lg:py-16">
      <header className="mb-8 border-b border-border pb-6">
        <div className="h-3 w-20 bg-muted" />
        <div className="mt-3 h-9 w-64 bg-muted" />
        <div className="mt-4 flex items-center gap-3">
          <div className="h-3 w-20 bg-muted" />
          <div className="h-px w-8 bg-border" />
          <div className="h-3 w-20 bg-muted" />
          <div className="h-px w-8 bg-border" />
          <div className="h-3 w-16 bg-muted" />
        </div>
        <div className="mt-6 h-16 w-full rounded-xl bg-muted" />
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 h-3 w-36 bg-muted" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="h-24 border border-border p-4">
              <div className="h-4 w-32 bg-muted" />
              <div className="mt-3 h-3 w-full bg-muted" />
              <div className="mt-2 h-3 w-2/3 bg-muted" />
            </div>
            <div className="h-24 border border-border p-4">
              <div className="h-4 w-32 bg-muted" />
              <div className="mt-3 h-3 w-full bg-muted" />
              <div className="mt-2 h-3 w-2/3 bg-muted" />
            </div>
          </div>
        </div>

        <aside>
          <div className="border border-border bg-secondary/30 p-6">
            <div className="h-5 w-24 bg-muted" />
            <ul className="mb-4 mt-4 divide-y divide-border">
              {[0, 1].map((i) => (
                <li key={i} className="flex justify-between gap-4 py-3">
                  <div className="h-4 w-2/5 bg-muted" />
                  <div className="h-4 w-16 bg-muted" />
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-muted" />
                <div className="h-4 w-16 bg-muted" />
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <div className="h-5 w-14 bg-muted" />
                <div className="h-5 w-20 bg-muted" />
              </div>
            </div>
            <div className="mt-6 h-12 w-full bg-muted" />
          </div>
        </aside>
      </div>
    </section>
  );
}
