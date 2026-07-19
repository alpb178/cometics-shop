import { Injectable } from "@nestjs/common";
import { MediaService } from "../media/media.service";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Serializa los componentes y dynamic zones que Strapi guarda en tablas
 * components_* + tablas *_cmps, devolviendo la misma forma aplanada que
 * el content API de Strapi v5 (los dynamic zones llevan __component).
 *
 * Solo cubre los componentes que existen en el contenido real de la BD
 * (ver api/CLAUDE.md); si el backoffice añade tipos nuevos habrá que
 * registrarlos aquí.
 */
@Injectable()
export class ComponentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  /** Componentes hijos registrados en una tabla *_cmps, en orden. */
  async children(cmpsTable: string, entityId: number, field?: string) {
    const delegate = (this.prisma as never as Record<string, {
      findMany: (args: unknown) => Promise<
        { cmp_id: number | null; component_type: string | null; field: string | null; order: number | null }[]
      >;
    }>)[cmpsTable];
    const rows = await delegate.findMany({
      where: { entity_id: entityId, ...(field ? { field } : {}) },
      orderBy: { order: "asc" },
    });
    return rows.filter((r) => r.cmp_id && r.component_type);
  }

  async serializeMany(cmpsTable: string, entityId: number, field?: string) {
    const rows = await this.children(cmpsTable, entityId, field);
    const out = [];
    for (const row of rows) {
      const serialized = await this.serialize(row.component_type!, row.cmp_id!);
      if (serialized) out.push(serialized);
    }
    return out;
  }

  async serialize(type: string, cmpId: number): Promise<Record<string, unknown> | null> {
    switch (type) {
      case "shared.link": {
        const r = await this.prisma.components_shared_links.findUnique({
          where: { id: cmpId },
        });
        return r && { id: r.id, text: r.text, URL: r.url, target: r.target };
      }
      case "shared.seo": {
        const r = await this.prisma.components_shared_seos.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        return {
          id: r.id,
          metaTitle: r.meta_title,
          metaDescription: r.meta_description,
          keywords: r.keywords,
          metaRobots: r.meta_robots,
          structuredData: r.structured_data,
          metaViewport: r.meta_viewport,
          canonicalURL: r.canonical_url,
          metaImage: await this.mediaService.findRelatedFile("shared.seo", r.id, "metaImage"),
        };
      }
      case "shared.steps": {
        const r = await this.prisma.components_shared_steps.findUnique({
          where: { id: cmpId },
        });
        return r && { id: r.id, title: r.title, description: r.description };
      }
      case "items.input": {
        const r = await this.prisma.components_items_inputs.findUnique({
          where: { id: cmpId },
        });
        return (
          r && {
            id: r.id,
            type: r.type,
            name: r.name,
            placeholder: r.placeholder,
            label: r.label,
            required: r.required,
          }
        );
      }
      case "shared.form": {
        const r = await this.prisma.components_shared_forms.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        return {
          id: r.id,
          inputs: await this.serializeMany("components_shared_forms_cmps", r.id, "inputs"),
        };
      }
      case "shared.section": {
        const r = await this.prisma.components_shared_sections.findUnique({
          where: { id: cmpId },
        });
        return r && { id: r.id, heading: r.heading, sub_heading: r.sub_heading, users: [] };
      }
      case "shared.story-panel-shared": {
        const r = await this.prisma.components_shared_story_panel_shareds.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        return {
          id: r.id,
          tittle: r.tittle, // sic — así se llama el campo en Strapi
          description: r.description,
          image: await this.mediaService.findRelatedFile(
            "shared.story-panel-shared",
            r.id,
            "image",
          ),
        };
      }
      case "dynamic-zone.faq": {
        const r = await this.prisma.components_dynamic_zone_faqs.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        const lnk = await this.prisma.components_dynamic_zone_faqs_faqs_lnk.findMany({
          where: { inv_faq_id: r.id },
          orderBy: { faq_ord: "asc" },
          include: { faqs: true },
        });
        return {
          __component: type,
          id: r.id,
          heading: r.heading,
          sub_heading: r.sub_heading,
          faqs: lnk
            .filter((l) => l.faqs)
            .map((l) => ({
              id: l.faqs!.id,
              documentId: l.faqs!.document_id,
              question: l.faqs!.question,
              answer: l.faqs!.answer,
            })),
        };
      }
      case "dynamic-zone.story-panel": {
        const r = await this.prisma.components_dynamic_zone_story_panels.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        return {
          __component: type,
          id: r.id,
          storys: await this.serializeMany(
            "components_dynamic_zone_story_panels_cmps",
            r.id,
            "storys",
          ),
        };
      }
      case "dynamic-zone.how-it-works": {
        const r = await this.prisma.components_dynamic_zone_how_it_works.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        return {
          __component: type,
          id: r.id,
          heading: r.heading,
          sub_heading: r.sub_heading,
          steps: await this.serializeMany(
            "components_dynamic_zone_how_it_works_cmps",
            r.id,
            "steps",
          ),
        };
      }
      case "dynamic-zone.form-next-to-section": {
        const r =
          await this.prisma.components_dynamic_zone_form_next_to_sections.findUnique({
            where: { id: cmpId },
          });
        if (!r) return null;
        const socials = await this.prisma
          .components_dynamic_zone_form_n2610e_social_networks_lnk.findMany({
            where: { form_next_to_section_id: r.id },
            orderBy: { social_network_ord: "asc" },
            include: { social_networks: true },
          });
        const [form] = await this.serializeMany(
          "components_dynamic_zone_form_next_to_sections_cmps",
          r.id,
          "form",
        );
        const [section] = await this.serializeMany(
          "components_dynamic_zone_form_next_to_sections_cmps",
          r.id,
          "section",
        );
        return {
          __component: type,
          id: r.id,
          heading: r.heading,
          sub_heading: r.sub_heading,
          form: form ?? null,
          section: section ?? null,
          social_networks: await Promise.all(
            socials
              .filter((s) => s.social_networks)
              .map((s) => this.serializeSocialNetwork(s.social_networks!)),
          ),
        };
      }
      case "global.navbar": {
        const r = await this.prisma.components_global_navbars.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        const logoLnk = await this.prisma.components_global_navbars_logo_lnk.findFirst({
          where: { navbar_id: r.id },
          include: { logos: true },
        });
        return {
          id: r.id,
          logo: logoLnk?.logos ? await this.serializeLogo(logoLnk.logos) : null,
          left_navbar_items: await this.serializeMany(
            "components_global_navbars_cmps",
            r.id,
            "left_navbar_items",
          ),
          right_navbar_items: await this.serializeMany(
            "components_global_navbars_cmps",
            r.id,
            "right_navbar_items",
          ),
        };
      }
      case "global.footer": {
        const r = await this.prisma.components_global_footers.findUnique({
          where: { id: cmpId },
        });
        if (!r) return null;
        const [logoLnk, socials] = await Promise.all([
          this.prisma.components_global_footers_logo_lnk.findFirst({
            where: { footer_id: r.id },
            include: { logos: true },
          }),
          this.prisma.components_global_footers_social_networks_lnk.findMany({
            where: { footer_id: r.id },
            orderBy: { social_network_ord: "asc" },
            include: { social_networks: true },
          }),
        ]);
        return {
          id: r.id,
          description: r.description,
          copyright: r.copyright,
          designed_developed_by: r.designed_developed_by,
          built_with: r.built_with,
          logo: logoLnk?.logos ? await this.serializeLogo(logoLnk.logos) : null,
          internal_links: await this.serializeMany(
            "components_global_footers_cmps",
            r.id,
            "internal_links",
          ),
          policy_links: await this.serializeMany(
            "components_global_footers_cmps",
            r.id,
            "policy_links",
          ),
          social_networks: await Promise.all(
            socials
              .filter((s) => s.social_networks)
              .map((s) => this.serializeSocialNetwork(s.social_networks!)),
          ),
        };
      }
      default:
        return null; // tipo no registrado: se omite, como haría un populate parcial
    }
  }

  async serializeSocialNetwork(row: {
    id: number;
    document_id: string | null;
    alias: string | null;
    name: string | null;
  }) {
    const linkCmp = await this.prisma.social_networks_cmps.findFirst({
      where: { entity_id: row.id, field: "link" },
    });
    return {
      id: row.id,
      documentId: row.document_id,
      alias: row.alias,
      name: row.name,
      link: linkCmp?.cmp_id
        ? await this.serialize("shared.link", linkCmp.cmp_id)
        : null,
    };
  }

  async serializeLogo(row: {
    id: number;
    document_id: string | null;
    company: string | null;
  }) {
    const [image, imageDark] = await Promise.all([
      this.mediaService.findRelatedFile("api::logo.logo", row.id, "image"),
      this.mediaService.findRelatedFile("api::logo.logo", row.id, "imageDark"),
    ]);
    return {
      id: row.id,
      documentId: row.document_id,
      company: row.company,
      image,
      imageDark,
    };
  }
}
