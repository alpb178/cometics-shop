import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { strapiError } from "../common/strapi-error";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";

type UpUserRow = {
  id: number;
  document_id: string | null;
  username: string | null;
  email: string | null;
  provider: string | null;
  password: string | null;
  confirmed: boolean | null;
  blocked: boolean | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  /** Mismo payload que los JWT de users-permissions: { id }. */
  issueJwt(userId: number): string {
    return this.jwtService.sign({ id: userId });
  }

  /** Forma de user que devuelve Strapi en { jwt, user } (sanitizado, plano). */
  sanitizeUser(user: UpUserRow) {
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
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async login(identifier: string, password: string) {
    if (!identifier || !password) {
      throw strapiError(400, "ValidationError", "Invalid identifier or password");
    }
    const user = await this.prisma.up_users.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: "insensitive" } },
          { username: { equals: identifier, mode: "insensitive" } },
        ],
        provider: "local",
      },
    });
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      throw strapiError(400, "ValidationError", "Invalid identifier or password");
    }
    if (user.blocked) {
      throw strapiError(
        400,
        "ApplicationError",
        "Your account has been blocked by an administrator",
      );
    }
    return { jwt: this.issueJwt(user.id), user: this.sanitizeUser(user) };
  }

  async register(username: string, email: string, password: string) {
    if (!username || !email || !password) {
      throw strapiError(400, "ValidationError", "Missing required fields");
    }
    const existing = await this.prisma.up_users.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          { username: { equals: username, mode: "insensitive" } },
        ],
      },
    });
    if (existing) {
      throw strapiError(
        400,
        "ApplicationError",
        "Email or Username are already taken",
      );
    }
    const user = await this.usersService.createUser({
      username,
      email,
      password,
      provider: "local",
      confirmed: true,
    });
    return { jwt: this.issueJwt(user.id), user: this.sanitizeUser(user) };
  }

  // ---- Google OAuth (mismo flujo que el provider de users-permissions) ----

  googleAuthorizeUrl(): string {
    const clientId = this.config.getOrThrow<string>("GOOGLE_CLIENT_ID");
    const redirectUri = `${this.config.getOrThrow<string>("PUBLIC_URL")}/api/connect/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "email profile",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /** Intercambia el code por un access_token de Google. */
  async exchangeGoogleCode(code: string): Promise<string> {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.config.getOrThrow<string>("GOOGLE_CLIENT_ID"),
        client_secret: this.config.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
        redirect_uri: `${this.config.getOrThrow<string>("PUBLIC_URL")}/api/connect/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const data = (await res.json()) as { access_token?: string };
    if (!res.ok || !data.access_token) {
      throw strapiError(400, "ApplicationError", "Invalid Google code");
    }
    return data.access_token;
  }

  /** Valida el access_token con Google y devuelve { jwt, user }, creando el usuario si no existe. */
  async googleCallback(accessToken: string) {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      throw strapiError(400, "ApplicationError", "Invalid Google access token");
    }
    const info = (await res.json()) as { email?: string; name?: string };
    if (!info.email) {
      throw strapiError(400, "ApplicationError", "Google account has no email");
    }
    let user = await this.prisma.up_users.findFirst({
      where: { email: { equals: info.email, mode: "insensitive" } },
    });
    if (!user) {
      user = await this.usersService.createUser({
        username: info.name ?? info.email.split("@")[0],
        email: info.email,
        provider: "google",
        confirmed: true,
      });
    }
    if (user.blocked) {
      throw strapiError(
        400,
        "ApplicationError",
        "Your account has been blocked by an administrator",
      );
    }
    return { jwt: this.issueJwt(user.id), user: this.sanitizeUser(user) };
  }

  // ---- Reset de contraseña ----

  async forgotPassword(email: string) {
    const user = await this.prisma.up_users.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        provider: "local",
      },
    });
    // Siempre { ok: true } para no revelar si el email existe, como Strapi
    if (!user?.email) return { ok: true };
    const token = randomBytes(32).toString("hex");
    await this.prisma.up_users.update({
      where: { id: user.id },
      data: { reset_password_token: token, updated_at: new Date() },
    });
    const url = `${this.config.get("CLIENT_URL", "http://localhost:3000")}/reset-password?code=${token}`;
    await this.mailService
      .send(
        user.email,
        "Restablecer contraseña — Iris Natural",
        `<p>Para restablecer tu contraseña haz clic en el siguiente enlace:</p><p><a href="${url}">${url}</a></p><p>Si no lo has solicitado, ignora este mensaje.</p>`,
      )
      .catch((err) => this.logger.error(`Error enviando email: ${err}`));
    return { ok: true };
  }

  async resetPassword(code: string, password: string, passwordConfirmation: string) {
    if (!code || !password || password !== passwordConfirmation) {
      throw strapiError(400, "ValidationError", "Passwords do not match");
    }
    const user = await this.prisma.up_users.findFirst({
      where: { reset_password_token: code },
    });
    if (!user) {
      throw strapiError(400, "ValidationError", "Incorrect code provided");
    }
    const updated = await this.prisma.up_users.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, 10),
        reset_password_token: null,
        updated_at: new Date(),
      },
    });
    return { jwt: this.issueJwt(updated.id), user: this.sanitizeUser(updated) };
  }
}
