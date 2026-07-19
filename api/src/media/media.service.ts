import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface MediaFile {
  id: number;
  documentId: string | null;
  name: string | null;
  alternativeText: string | null;
  url: string | null;
  mime: string | null;
  width: number | null;
  height: number | null;
  formats: unknown;
}

/**
 * Lectura/escritura de la tabla polimórfica files_related_mph con la que
 * Strapi asocia media a entidades (related_type + related_id + field).
 */
@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findRelatedFile(
    relatedType: string,
    relatedId: number,
    field: string,
  ): Promise<MediaFile | null> {
    const rel = await this.prisma.files_related_mph.findFirst({
      where: { related_type: relatedType, related_id: relatedId, field },
      orderBy: { order: "asc" },
      include: { files: true },
    });
    return rel?.files ? this.toMediaFile(rel.files) : null;
  }

  async setRelatedFile(
    relatedType: string,
    relatedId: number,
    field: string,
    fileId: number | null,
  ): Promise<void> {
    await this.prisma.files_related_mph.deleteMany({
      where: { related_type: relatedType, related_id: relatedId, field },
    });
    if (fileId) {
      await this.prisma.files_related_mph.create({
        data: {
          file_id: fileId,
          related_id: relatedId,
          related_type: relatedType,
          field,
          order: 1,
        },
      });
    }
  }

  toMediaFile(file: {
    id: number;
    document_id: string | null;
    name: string | null;
    alternative_text: string | null;
    url: string | null;
    mime: string | null;
    width: number | null;
    height: number | null;
    formats: unknown;
  }): MediaFile {
    return {
      id: file.id,
      documentId: file.document_id,
      name: file.name,
      alternativeText: file.alternative_text,
      url: file.url,
      mime: file.mime,
      width: file.width,
      height: file.height,
      formats: file.formats,
    };
  }
}
