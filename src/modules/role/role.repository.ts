import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class RoleRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      const cacheRoles: string[] | undefined | null = await this.cacheManager.get('roles');
      if (cacheRoles && cacheRoles.length > 0) return cacheRoles;
      else {
        const roles = await this.prisma.role.findMany({
          where: {},
          select: { id: true, name: true },
        });
        if (roles.length === 0) throw new BadRequestException('Nenhuma papel encontrado');
        await this.cacheManager.set('roles', roles, 60 * 60 * 24);
        return roles;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findById(id: string): Promise<any> {
    try {
      return this.prisma.role.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          slug: true,
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  action: true,
                  entity: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
