import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { nestedQuery, parsePageSize } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";
import { ComponentsService } from "./components.service";

@ApiTags("social-networks")
@Controller("social-networks")
export class SocialNetworksController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly componentsService: ComponentsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Redes sociales (status=draft para el backoffice)",
    description:
      "`status=draft` devuelve todas las redes (vista del backoffice), una por " +
      "documento; sin él, solo las publicadas (vista pública).",
  })
  async find(@Query() query: Record<string, unknown>) {
    // `status=draft` significaba lo contrario que en products: allí es "todas
    // las filas" (vista admin) y aquí devolvía SOLO las filas borrador. Con el
    // draft & publish heredado eso funcionaba de casualidad —cada red tiene
    // fila borrador y publicada—, pero una red que existiera solo publicada era
    // invisible en el backoffice. Ahora draft = todas, deduplicando por
    // documento y prefiriendo la fila publicada.
    const all = query.status === "draft";
    const rows = await this.prisma.social_networks.findMany({
      where: all ? {} : { published_at: { not: null } },
      // published_at desc deja primero la fila publicada de cada documento
      // (NULLS LAST), que es la que refleja lo que ve la tienda.
      orderBy: [{ published_at: { sort: "desc", nulls: "last" } }, { id: "asc" }],
      take: parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100),
    });
    const seen = new Set<string>();
    const unique = rows.filter((r) => {
      if (!r.document_id) return true; // sin documento: se mantiene individual
      if (seen.has(r.document_id)) return false;
      seen.add(r.document_id);
      return true;
    });
    unique.sort((a, b) => a.id - b.id); // orden de presentación estable
    const data = await Promise.all(
      unique.map((r) => this.componentsService.serializeSocialNetwork(r)),
    );
    return { data, meta: {} };
  }
}
