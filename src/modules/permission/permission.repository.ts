import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PermissionRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly prisma: PrismaService) {}
  async findAll(queryPermissionDto: QueryPermissionDto): Promise<any> {
    try {
      const cachePermissions: string[] | undefined | null = await this.cacheManager.get('permissions');
      if (cachePermissions && cachePermissions.length > 0 && !queryPermissionDto.search) return cachePermissions;
      else {
        const permissions = await this.prisma.permission.findMany({
          where: {
            OR: [
              { name: { contains: queryPermissionDto.search || '', mode: 'insensitive' } },
              { slug: { contains: queryPermissionDto.search || '', mode: 'insensitive' } },
            ],
          },
          select: { id: true, action: true, entity: true, description: true, name: true, slug: true },
        });
        if (permissions.length === 0) throw new BadRequestException('Nenhuma permissão encontrada');
        if (!queryPermissionDto.search) await this.cacheManager.set('permissions', permissions, 60 * 60 * 24);
        return permissions;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async create(createPermissionDto: any): Promise<any> {
    try {
      return this.prisma.permission.create({ data: createPermissionDto });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
