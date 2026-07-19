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
  @ApiOperation({ summary: "Redes sociales (status=draft para el backoffice)" })
  async find(@Query() query: Record<string, unknown>) {
    const rows = await this.prisma.social_networks.findMany({
      where: {
        published_at: query.status === "draft" ? null : { not: null },
      },
      orderBy: { id: "asc" },
      take: parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100),
    });
    const data = await Promise.all(
      rows.map((r) => this.componentsService.serializeSocialNetwork(r)),
    );
    return { data, meta: {} };
  }
}
