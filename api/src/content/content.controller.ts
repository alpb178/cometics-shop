import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { nestedQuery } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";
import { ComponentsService } from "./components.service";

/**
 * Contenido CMS de lectura pública: páginas (dynamic zone) y global (footer).
 * La navbar y el SEO del front son estáticos (lib/constants/navbar y
 * lib/seo-pages), así que no se sirven desde la BD.
 */
@ApiTags("content")
@Controller()
export class ContentController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly componentsService: ComponentsService,
  ) {}

  @Get("pages")
  @ApiOperation({ summary: "Páginas CMS (filters[slug], filters[locale])" })
  async pages(@Query() query: Record<string, unknown>) {
    const slug = nestedQuery(query, "filters", "slug");
    const locale = nestedQuery(query, "filters", "locale");
    const rows = await this.prisma.pages.findMany({
      where: {
        published_at: { not: null },
        ...(slug ? { slug } : {}),
        ...(locale ? { locale } : {}),
      },
      orderBy: { id: "asc" },
    });
    const data = await Promise.all(rows.map((r) => this.serializePage(r)));
    return { data, meta: {} };
  }

  @Get("global")
  @ApiOperation({ summary: "Global (footer) — single type" })
  async global(@Query() query: Record<string, unknown>) {
    const locale = nestedQuery(query, "filters", "locale");
    const row = await this.prisma.globals.findFirst({
      where: {
        published_at: { not: null },
        ...(locale ? { locale } : {}),
      },
      orderBy: { id: "asc" },
    });
    if (!row) throw new NotFoundException();
    const [footer] = await this.componentsService.serializeMany(
      "globals_cmps",
      row.id,
      "footer",
    );
    return {
      data: {
        id: row.id,
        documentId: row.document_id,
        locale: row.locale,
        footer: footer ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        publishedAt: row.published_at,
      },
      meta: {},
    };
  }

  private async serializePage(row: {
    id: number;
    document_id: string | null;
    slug: string | null;
    locale: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    published_at: Date | null;
  }) {
    const dynamicZone = await this.componentsService.serializeMany(
      "pages_cmps",
      row.id,
      "dynamic_zone",
    );
    return {
      id: row.id,
      documentId: row.document_id,
      slug: row.slug,
      locale: row.locale,
      dynamic_zone: dynamicZone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
    };
  }
}
