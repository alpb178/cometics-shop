import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/staff.util";
import { strapiError } from "../common/strapi-error";
import { UsersService } from "./users.service";

/**
 * Replica of the users-permissions endpoints the clients use.
 * Note: FLAT bodies and responses (no { data } envelope), like the plugin.
 */
@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("users/me")
  @ApiOperation({ summary: "Authenticated user (with role)" })
  async me(@CurrentUser() user: AuthenticatedUser) {
    const row = await this.usersService.getUserWithRole(user.id);
    if (!row) throw new NotFoundException();
    return this.usersService.serializeUser(row);
  }

  @Put("users/me")
  @ApiOperation({ summary: "Update own profile (firstName, lastName, phone)" })
  async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { firstName?: string; lastName?: string; phone?: string },
  ) {
    await this.usersService.updateUser(user.id, {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
    });
    return this.me(user);
  }

  @Get("users")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "List users (staff only) — flat array" })
  listUsers() {
    return this.usersService.listUsersWithRole();
  }

  @Post("users")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Create user (staff only)" })
  async createUser(
    @Body()
    body: {
      username?: string;
      email?: string;
      password?: string;
      role?: number;
      confirmed?: boolean;
    },
  ) {
    if (!body.username || !body.email || !body.password) {
      throw strapiError(400, "ValidationError", "Missing required fields");
    }
    const user = await this.usersService.createUser({
      username: body.username,
      email: body.email,
      password: body.password,
      provider: "local",
      confirmed: body.confirmed ?? true,
      roleId: body.role ?? null,
    });
    const row = await this.usersService.getUserWithRole(user.id);
    return row ? this.usersService.serializeUser(row) : null;
  }

  @Put("users/:id")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Update user (staff only)" })
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body()
    body: {
      username?: string;
      email?: string;
      password?: string;
      role?: number;
      confirmed?: boolean;
      blocked?: boolean;
    },
  ) {
    await this.usersService.updateUser(id, body);
    const row = await this.usersService.getUserWithRole(id);
    return row ? this.usersService.serializeUser(row) : null;
  }

  @Delete("users/:id")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Delete user (staff only)" })
  async deleteUser(@Param("id", ParseIntPipe) id: number) {
    const deleted = await this.usersService.deleteUser(id);
    return this.usersService.serializeUser(deleted);
  }

  @Get("users-permissions/roles")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Available roles (staff only)" })
  async roles() {
    const roles = await this.usersService.getRoles();
    return {
      roles: roles.map((r) => ({
        id: r.id,
        documentId: r.document_id,
        name: r.name,
        description: r.description,
        type: r.type,
      })),
    };
  }
}
