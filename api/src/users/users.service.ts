import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { AuthenticatedUser } from "../common/staff.util";
import { generateDocumentId } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

type UserWithRole = {
  id: number;
  document_id: string | null;
  username: string | null;
  email: string | null;
  provider: string | null;
  confirmed: boolean | null;
  blocked: boolean | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  up_users_role_lnk: {
    up_roles: {
      id: number;
      document_id: string | null;
      name: string | null;
      description: string | null;
      type: string | null;
    } | null;
  }[];
};

const ROLE_INCLUDE = {
  up_users_role_lnk: { include: { up_roles: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findWithRole(id: number): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.up_users.findUnique({
      where: { id },
      include: ROLE_INCLUDE,
    });
    if (!user) return null;
    return this.toAuthenticatedUser(user);
  }

  async createUser(input: {
    username: string;
    email: string;
    password?: string;
    provider: string;
    confirmed: boolean;
    roleId?: number | null;
  }) {
    const now = new Date();
    const roleId = input.roleId ?? (await this.getDefaultRoleId());
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.up_users.create({
        data: {
          document_id: generateDocumentId(),
          username: input.username,
          email: input.email.toLowerCase(),
          provider: input.provider,
          password: input.password
            ? await bcrypt.hash(input.password, 10)
            : null,
          confirmed: input.confirmed,
          blocked: false,
          created_at: now,
          updated_at: now,
          published_at: now,
        },
      });
      if (roleId) {
        await tx.up_users_role_lnk.create({
          data: { user_id: user.id, role_id: roleId, user_ord: 1 },
        });
      }
      return user;
    });
  }

  /** Actualización parcial estilo users-permissions (password se rehashea, role se reenlaza). */
  async updateUser(
    id: number,
    input: {
      username?: string;
      email?: string;
      password?: string;
      confirmed?: boolean;
      blocked?: boolean;
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: number;
    },
  ) {
    const existing = await this.prisma.up_users.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.up_users.update({
        where: { id },
        data: {
          username: input.username,
          email: input.email?.toLowerCase(),
          password: input.password
            ? await bcrypt.hash(input.password, 10)
            : undefined,
          confirmed: input.confirmed,
          blocked: input.blocked,
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          updated_at: new Date(),
        },
      });
      if (input.role !== undefined) {
        await tx.up_users_role_lnk.deleteMany({ where: { user_id: id } });
        await tx.up_users_role_lnk.create({
          data: { user_id: id, role_id: input.role, user_ord: 1 },
        });
      }
      return user;
    });
  }

  async deleteUser(id: number) {
    const existing = await this.prisma.up_users.findUnique({
      where: { id },
      include: ROLE_INCLUDE,
    });
    if (!existing) throw new NotFoundException();
    await this.prisma.up_users.delete({ where: { id } });
    return existing;
  }

  async listUsersWithRole() {
    const users = await this.prisma.up_users.findMany({
      include: ROLE_INCLUDE,
      orderBy: { id: "asc" },
    });
    return users.map((u) => this.serializeUser(u));
  }

  async getUserWithRole(id: number): Promise<UserWithRole | null> {
    return this.prisma.up_users.findUnique({
      where: { id },
      include: ROLE_INCLUDE,
    });
  }

  async getRoles() {
    return this.prisma.up_roles.findMany({ orderBy: { id: "asc" } });
  }

  private async getDefaultRoleId(): Promise<number | null> {
    // Como el seed de Strapi: el rol por defecto del registro es `client`
    const role =
      (await this.prisma.up_roles.findFirst({ where: { type: "client" } })) ??
      (await this.prisma.up_roles.findFirst({
        where: { type: "authenticated" },
      }));
    return role?.id ?? null;
  }

  /** User plano estilo users-permissions, con role incluido. */
  serializeUser(user: UserWithRole) {
    const role = user.up_users_role_lnk[0]?.up_roles ?? null;
    return {
      id: user.id,
      documentId: user.document_id,
      username: user.username,
      email: user.email,
      provider: user.provider,
      confirmed: user.confirmed,
      blocked: user.blocked,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: role
        ? {
            id: role.id,
            documentId: role.document_id,
            name: role.name,
            description: role.description,
            type: role.type,
          }
        : null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  toAuthenticatedUser(user: UserWithRole & { password?: string | null }): AuthenticatedUser {
    const role = user.up_users_role_lnk[0]?.up_roles ?? null;
    return {
      id: user.id,
      documentId: user.document_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      confirmed: user.confirmed,
      blocked: user.blocked,
      roleType: role?.type ?? null,
      roleId: role?.id ?? null,
    };
  }
}
