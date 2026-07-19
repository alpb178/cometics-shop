import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { isStaffUser } from "../common/staff.util";

/**
 * Equivalente a ensureStaff() del backend Strapi: 401 sin usuario,
 * 403 si el usuario no es staff. Usar siempre detrás de JwtAuthGuard.
 */
@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    if (!user) throw new UnauthorizedException();
    if (!isStaffUser(user)) throw new ForbiddenException();
    return true;
  }
}
