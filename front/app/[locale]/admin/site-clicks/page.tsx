import { PageHeader } from "@/components/admin/page-header";
import { RefreshButton } from "@/components/admin/refresh-button";
import { AdminTable } from "@/components/admin/ui";
import { getGroupClicks } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

const right = (label: string) => (
  <span className="block text-right">{label}</span>
);

/** Clics en la sección "Sitios de interés" (tarjetas del Grupo CorpSC). */
export default async function SiteClicksPage() {
  const [d30, d7] = await Promise.all([
    getGroupClicks(30, 50).catch(() => []),
    getGroupClicks(7, 50).catch(() => []),
  ]);
  const by7 = new Map(d7.map((r) => [r.label, r.count]));
  const total30 = d30.reduce((acc, r) => acc + r.count, 0);

  return (
    <div>
      <PageHeader
        title="Sitios de interés"
        subtitle={`Clics en las tarjetas del Grupo CorpSC · ${total30} en los últimos 30 días`}
        action={<RefreshButton />}
      />
      <AdminTable
        empty="Aún no hay clics registrados."
        headers={[
          "Sitio",
          right("Clics · 30 días"),
          right("Clics · 7 días"),
        ]}
      >
        {d30.map((r) => (
          <tr key={r.label ?? "—"} className="hover:bg-neutral-50">
            <td className="px-4 py-3 font-medium text-neutral-900">
              {r.label ?? "—"}
            </td>
            <td className="px-4 py-3 text-right font-medium text-neutral-700">
              {r.count}
            </td>
            <td className="px-4 py-3 text-right text-neutral-500">
              {by7.get(r.label) ?? 0}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
