import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Serialización de redes sociales (alias/name + su link). El resto del
 * contenido CMS de Strapi (páginas, navbar, footer, dynamic zones) se retiró:
 * el front lo maneja de forma estática. Solo queda lo que consume
 * SocialNetworksController.
 */
@Injectable()
export class ComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  async serializeSocialNetwork(row: {
    id: number;
    document_id: string | null;
    alias: string | null;
    name: string | null;
  }) {
    const linkCmp = await this.prisma.social_networks_cmps.findFirst({
      where: { entity_id: row.id, field: "link" },
    });
    let link: { id: number; text: string | null; URL: string | null; target: string | null } | null =
      null;
    if (linkCmp?.cmp_id) {
      const l = await this.prisma.components_shared_links.findUnique({
        where: { id: linkCmp.cmp_id },
      });
      if (l) link = { id: l.id, text: l.text, URL: l.url, target: l.target };
    }
    return {
      id: row.id,
      documentId: row.document_id,
      alias: row.alias,
      name: row.name,
      link,
    };
  }
}
