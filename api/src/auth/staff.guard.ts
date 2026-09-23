import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { isStaffUser } from "../common/staff.util";

/**
 * Equivalent of the Strapi backend's ensureStaff(): 401 without a user,
 * 403 if the user isn't staff. Always use it behind JwtAuthGuard.
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
