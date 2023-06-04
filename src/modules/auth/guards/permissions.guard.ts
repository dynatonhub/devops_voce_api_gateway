import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions: string[] | undefined | null = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true;
    const { user } = context.switchToHttp().getRequest();
    const userPermissions: string[] | undefined | null = await this.cacheManager.get(user.sub);
    if (!userPermissions) return false;
    const hasPermission: boolean = requiredPermissions.every(permission => userPermissions.includes(permission));
    return hasPermission;
  }
}
