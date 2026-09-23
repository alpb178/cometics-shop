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
    summary: "Social networks (status=draft for the backoffice)",
    description:
      "`status=draft` returns every network (backoffice view), one per " +
      "document; without it, only the published ones (public view).",
  })
  async find(@Query() query: Record<string, unknown>) {
    // `status=draft` used to mean the opposite of products: there it is "all
    // rows" (admin view) and here it returned ONLY the draft rows. With the
    // inherited draft & publish that worked by accident —every network has a
    // draft and a published row—, but a network that only existed as published
    // was invisible in the backoffice. Now draft = all, deduplicated by
    // document and preferring the published row.
    const all = query.status === "draft";
    const rows = await this.prisma.social_networks.findMany({
      where: all ? {} : { published_at: { not: null } },
      // published_at desc puts each document's published row first
      // (NULLS LAST), which is the one that reflects what the store shows.
      orderBy: [{ published_at: { sort: "desc", nulls: "last" } }, { id: "asc" }],
      take: parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100),
    });
    const seen = new Set<string>();
    const unique = rows.filter((r) => {
      if (!r.document_id) return true; // no document: kept as an individual row
      if (seen.has(r.document_id)) return false;
      seen.add(r.document_id);
      return true;
    });
    unique.sort((a, b) => a.id - b.id); // stable display order
    const data = await Promise.all(
      unique.map((r) => this.componentsService.serializeSocialNetwork(r)),
    );
    return { data, meta: {} };
  }
}
