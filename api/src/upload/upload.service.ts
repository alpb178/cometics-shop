import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { randomBytes } from "crypto";
import { extname } from "path";
import { strapiError } from "../common/strapi-error";
import { generateDocumentId } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Equivalent of the Strapi plugin's POST /api/upload with the Cloudinary
 * provider: uploads the file and creates the `files` row with the same data
 * shape (url, formats.thumbnail, hash, provider, size in KB…).
 */
@Injectable()
export class UploadService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get("CLOUDINARY_NAME"),
      api_key: this.config.get("CLOUDINARY_KEY"),
      api_secret: this.config.get("CLOUDINARY_SECRET"),
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    if (!files?.length) {
      throw strapiError(400, "ValidationError", "Files are empty");
    }
    return Promise.all(files.map((f) => this.uploadOne(f)));
  }

  private async uploadOne(file: Express.Multer.File) {
    const ext = extname(file.originalname);
    const base = file.originalname
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "_");
    const hash = `${base}_${randomBytes(6).toString("hex")}`;
    const isImage = file.mimetype.startsWith("image/");

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: hash,
            resource_type: isImage ? "image" : "raw",
          },
          (err, result) => (err || !result ? reject(err) : resolve(result)),
        )
        .end(file.buffer);
    });

    // Strapi-style thumbnail (245px) via a Cloudinary transformation
    const formats = isImage
      ? {
          thumbnail: {
            ext,
            url: cloudinary.url(uploaded.public_id, {
              secure: true,
              transformation: [{ width: 245, crop: "limit" }],
              format: uploaded.format,
            }),
            hash: `thumbnail_${hash}`,
            mime: file.mimetype,
            width: Math.min(245, uploaded.width ?? 245),
            height: uploaded.height
              ? Math.round(
                  (Math.min(245, uploaded.width ?? 245) /
                    (uploaded.width ?? 245)) *
                    uploaded.height,
                )
              : null,
          },
        }
      : undefined;

    const now = new Date();
    const row = await this.prisma.files.create({
      data: {
        document_id: generateDocumentId(),
        name: file.originalname,
        hash,
        ext,
        mime: file.mimetype,
        size: Math.round((file.size / 1024) * 100) / 100,
        url: uploaded.secure_url,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        formats: formats as never,
        provider: "cloudinary",
        provider_metadata: {
          public_id: uploaded.public_id,
          resource_type: uploaded.resource_type,
        } as never,
        folder_path: "/",
        created_at: now,
        updated_at: now,
        published_at: now,
      },
    });
    return {
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      alternativeText: null,
      caption: null,
      width: row.width,
      height: row.height,
      formats: row.formats,
      hash: row.hash,
      ext: row.ext,
      mime: row.mime,
      size: Number(row.size),
      url: row.url,
      provider: row.provider,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
