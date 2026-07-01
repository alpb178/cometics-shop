import { PageHeader } from "@/components/page-header";
import { getPaymentInfo, listFaqs, listSocials } from "@/lib/data";
import { PaymentInfoForm } from "./payment-info-form";
import { FaqManager } from "./faq-manager";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [info, faqs, socials] = await Promise.all([
    getPaymentInfo().catch(() => null),
    listFaqs().catch(() => []),
    listSocials().catch(() => [])
  ]);

  return (
    <div className="space-y-10">
      <div>
        <PageHeader
          title="Contenido"
          subtitle="Datos de pago, preguntas frecuentes y redes sociales"
        />
        <h2 className="mb-3 text-lg font-semibold">Datos de pago</h2>
        <PaymentInfoForm info={info} />
      </div>

      <FaqManager faqs={faqs} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Redes sociales</h2>
        <div className="card divide-y divide-neutral-100">
          {socials.map((s) => (
            <div
              key={s.documentId}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <span className="font-medium capitalize">{s.name}</span>
                <span className="ml-2 text-neutral-500">{s.alias}</span>
              </div>
              {s.link?.URL && (
                <a
                  href={s.link.URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand hover:underline"
                >
                  {s.link.URL}
                </a>
              )}
            </div>
          ))}
          {socials.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-neutral-400">
              Sin redes sociales configuradas.
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-neutral-400">
          Las redes sociales se editan desde el panel de Strapi.
        </p>
      </div>
    </div>
  );
}
