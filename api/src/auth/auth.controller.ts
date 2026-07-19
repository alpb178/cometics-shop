import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";

/**
 * Endpoints con los mismos paths y cuerpos (planos, sin { data }) que
 * users-permissions de Strapi, que es lo que llaman front y backoffice.
 */
@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("auth/local")
  @ApiOperation({ summary: "Login con email/username + contraseña" })
  login(@Body() body: { identifier?: string; password?: string }) {
    return this.authService.login(body.identifier ?? "", body.password ?? "");
  }

  @Post("auth/local/register")
  @ApiOperation({ summary: "Registro de usuario (rol client)" })
  register(
    @Body() body: { username?: string; email?: string; password?: string },
  ) {
    return this.authService.register(
      body.username ?? "",
      body.email ?? "",
      body.password ?? "",
    );
  }

  @Post("auth/forgot-password")
  @ApiOperation({ summary: "Solicitar email de restablecimiento" })
  forgotPassword(@Body() body: { email?: string }) {
    return this.authService.forgotPassword(body.email ?? "");
  }

  @Post("auth/reset-password")
  @ApiOperation({ summary: "Restablecer contraseña con el código del email" })
  resetPassword(
    @Body()
    body: {
      code?: string;
      password?: string;
      passwordConfirmation?: string;
    },
  ) {
    return this.authService.resetPassword(
      body.code ?? "",
      body.password ?? "",
      body.passwordConfirmation ?? "",
    );
  }

  @Get("auth/google/callback")
  @ApiOperation({ summary: "Canjea el access_token de Google por { jwt, user }" })
  googleCallback(@Query("access_token") accessToken?: string) {
    return this.authService.googleCallback(accessToken ?? "");
  }

  @Get("connect/google")
  @ApiOperation({ summary: "Inicio del flujo OAuth con Google (redirección)" })
  connectGoogle(@Res() res: Response) {
    return res.redirect(this.authService.googleAuthorizeUrl());
  }

  @Get("connect/google/callback")
  @ApiOperation({ summary: "Callback OAuth: redirige al front con el access_token" })
  async connectGoogleCallback(
    @Query("code") code: string,
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.exchangeGoogleCode(code ?? "");
    const clientUrl = this.config.get("CLIENT_URL", "http://localhost:3000");
    return res.redirect(
      `${clientUrl}/api/auth/google?access_token=${encodeURIComponent(accessToken)}`,
    );
  }
}
