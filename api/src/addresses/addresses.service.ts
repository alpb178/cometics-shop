import { Injectable, NotFoundException } from "@nestjs/common";
import { generateDocumentId } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";
import { AddressDto } from "./address.dto";

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: number, pageSize: number) {
    const rows = await this.prisma.addresses.findMany({
      where: { addresses_user_lnk: { some: { user_id: userId } } },
      orderBy: [{ is_default: "desc" }, { created_at: "desc" }],
      take: pageSize,
    });
    return rows.map((r) => this.serialize(r));
  }

  /** 404 (no 403) si la dirección no existe o no es del usuario, como en Strapi. */
  async findOwnedOrThrow(id: number, userId: number) {
    const row = await this.prisma.addresses.findFirst({
      where: { id, addresses_user_lnk: { some: { user_id: userId } } },
    });
    if (!row) throw new NotFoundException();
    return row;
  }

  async create(userId: number, dto: AddressDto) {
    const now = new Date();
    const row = await this.prisma.$transaction(async (tx) => {
      const created = await tx.addresses.create({
        data: {
          document_id: generateDocumentId(),
          full_name: dto.fullName,
          phone: dto.phone,
          line_1: dto.line1,
          line_2: dto.line2,
          city: dto.city,
          department: dto.department,
          ci: dto.ci,
          notes: dto.notes,
          is_default: dto.isDefault ?? false,
          created_at: now,
          updated_at: now,
          published_at: now,
        },
      });
      await tx.addresses_user_lnk.create({
        data: { address_id: created.id, user_id: userId, address_ord: 1 },
      });
      return created;
    });
    return this.serialize(row);
  }

  async update(id: number, userId: number, dto: AddressDto) {
    await this.findOwnedOrThrow(id, userId);
    const row = await this.prisma.addresses.update({
      where: { id },
      data: {
        full_name: dto.fullName,
        phone: dto.phone,
        line_1: dto.line1,
        line_2: dto.line2,
        city: dto.city,
        department: dto.department,
        ci: dto.ci,
        notes: dto.notes,
        is_default: dto.isDefault,
        updated_at: new Date(),
      },
    });
    return this.serialize(row);
  }

  async delete(id: number, userId: number) {
    await this.findOwnedOrThrow(id, userId);
    const row = await this.prisma.addresses.delete({ where: { id } });
    return this.serialize(row);
  }

  serialize(row: {
    id: number;
    document_id: string | null;
    full_name: string | null;
    phone: string | null;
    line_1: string | null;
    line_2: string | null;
    city: string | null;
    department: string | null;
    ci: string | null;
    notes: string | null;
    is_default: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  }) {
    return {
      id: row.id,
      documentId: row.document_id,
      fullName: row.full_name,
      phone: row.phone,
      line1: row.line_1,
      line2: row.line_2,
      city: row.city,
      department: row.department,
      ci: row.ci,
      notes: row.notes,
      isDefault: row.is_default,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
