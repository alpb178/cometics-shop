import { PageHeader } from "@/components/page-header";
import { getPaymentInfo } from "@/lib/data";
import { QrForm } from "./qr-form";

export const dynamic = "force-dynamic";

export default async function PaymentQrPage() {
  const info = await getPaymentInfo().catch(() => null);

  return (
    <div>
      <PageHeader
        title="QR de pago"
        subtitle="Sube el código QR que se muestra a los clientes en el checkout"
      />
      <QrForm info={info} />
    </div>
  );
}
