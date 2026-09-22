"use client";

import Link from "next/link";
import { useState } from "react";
import { Pagination } from "@/components/admin/pagination";
import { AdminTable } from "@/components/admin/ui";

const PAGE_SIZE = 10;

export interface TopProductRow {
  slug: string | null;
  label: string;
  thumb: string | null;
  price: string;
  editHref: string | null;
  views30: number;
  views7: number;
}

export function TopProductsTable({ rows }: { rows: TopProductRow[] }) {
  const [page, setPage] = useState(1);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <AdminTable
        empty="Todavía no hay vistas de producto registradas."
        headers={["#", "Producto", "Precio", "Vistas 30 días", "Vistas 7 días"]}
      >
        {pageRows.map((r, i) => (
          <tr key={r.slug ?? i} className="hover:bg-surface-container-low">
            <td className="px-4 py-3 font-mono text-on-surface-variant">
              {(page - 1) * PAGE_SIZE + i + 1}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                  {r.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                {r.editHref ? (
                  <Link
                    href={r.editHref}
                    className="font-medium text-brand hover:underline"
                  >
                    {r.label}
                  </Link>
                ) : (
                  <span className="font-medium">{r.label}</span>
                )}
              </div>
            </td>
            <td className="px-4 py-3 text-on-surface-variant">{r.price}</td>
            <td className="px-4 py-3 font-semibold">{r.views30}</td>
            <td className="px-4 py-3 text-on-surface-variant">{r.views7}</td>
          </tr>
        ))}
      </AdminTable>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(rows.length / PAGE_SIZE))}
        total={rows.length}
        limit={PAGE_SIZE}
        onPage={setPage}
      />
    </div>
  );
}
