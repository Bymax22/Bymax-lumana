import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

function getBearerToken(request: any): string | undefined {
  const header = request.headers?.authorization;
  return typeof header === 'string' && header.startsWith('Bearer ')
    ? header.slice('Bearer '.length).trim()
    : undefined;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = await this.authService.findUserBySession(getBearerToken(request));

    if (!user) {
      throw new UnauthorizedException('A valid session is required.');
    }

    request.user = user;
    return true;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = String(request.path || request.url || '').replace(/^\/api(?=\/|$)/, '');

    if (!path.startsWith('/admin')) {
      return true;
    }

    const user = await this.authService.findUserBySession(getBearerToken(request));
    if (!user) {
      throw new UnauthorizedException('A valid admin session is required.');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Administrator access is required.');
    }

    request.user = user;
    return true;
  }
}