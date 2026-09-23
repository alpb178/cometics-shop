import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";

/**
 * Endpoints with the same paths and bodies (flat, without { data }) as
 * Strapi's users-permissions, which is what front and backoffice call.
 */
@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("auth/local")
  @ApiOperation({ summary: "Log in with email/username + password" })
  login(@Body() body: { identifier?: string; password?: string }) {
    return this.authService.login(body.identifier ?? "", body.password ?? "");
  }

  @Post("auth/local/register")
  @ApiOperation({ summary: "Register a user (client role)" })
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
  @ApiOperation({ summary: "Request a password reset email" })
  forgotPassword(@Body() body: { email?: string }) {
    return this.authService.forgotPassword(body.email ?? "");
  }

  @Post("auth/reset-password")
  @ApiOperation({ summary: "Reset the password with the code from the email" })
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
  @ApiOperation({ summary: "Exchange the Google access_token for { jwt, user }" })
  googleCallback(@Query("access_token") accessToken?: string) {
    return this.authService.googleCallback(accessToken ?? "");
  }

  @Get("connect/google")
  @ApiOperation({ summary: "Start the Google OAuth flow (redirect)" })
  connectGoogle(@Res() res: Response) {
    return res.redirect(this.authService.googleAuthorizeUrl());
  }

  @Get("connect/google/callback")
  @ApiOperation({ summary: "OAuth callback: redirects to the front with the access_token" })
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
