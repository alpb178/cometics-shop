import { Injectable } from "@nestjs/common";
import { AuthenticatedUser } from "../common/staff.util";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findWithRole(id: number): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.up_users.findUnique({
      where: { id },
      include: { up_users_role_lnk: { include: { up_roles: true } } },
    });
    if (!user) return null;
    return this.toAuthenticatedUser(user);
  }

  async findByEmail(email: string) {
    return this.prisma.up_users.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { up_users_role_lnk: { include: { up_roles: true } } },
    });
  }

  toAuthenticatedUser(user: {
    id: number;
    document_id: string | null;
    username: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    confirmed: boolean | null;
    blocked: boolean | null;
    up_users_role_lnk: { up_roles: { id: number; type: string | null } | null }[];
  }): AuthenticatedUser {
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
