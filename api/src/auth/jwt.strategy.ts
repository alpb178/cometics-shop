import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedUser } from "../common/staff.util";
import { UsersService } from "../users/users.service";

/**
 * Valida los JWT firmados con el mismo JWT_SECRET que usa Strapi
 * (payload `{ id }`), de modo que los tokens ya emitidos por Strapi
 * siguen siendo válidos durante la migración.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { id?: number }): Promise<AuthenticatedUser> {
    if (!payload?.id) throw new UnauthorizedException();
    const user = await this.usersService.findWithRole(payload.id);
    if (!user || user.blocked) throw new UnauthorizedException();
    return user;
  }
}
