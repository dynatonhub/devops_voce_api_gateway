import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/database/prisma.service';
import { QueryGroupDto } from './dto/query-group.dto';

@Injectable()
export class GroupRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(createGroupDto: any) {
    try {
      const { permissions, ...data } = createGroupDto;
      return this.prisma.group.create({
        data: {
          ...data,
          permissions: {
            create: permissions,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(queryGroupDto: QueryGroupDto): Promise<any> {
    try {
      // const sql: TemplateStringsArray = `SELECT id, name, description FROM 'Group' WHERE deleted_at IS NULL AND (unaccent('name') ILIKE unaccent('%${queryGroupDto.search}%' OR 'name' $1 = '')`;
      // return this.prisma.$queryRaw(sql);
      return this.prisma.group.findMany({
        where: { deleted_at: null, OR: [{ name: { contains: queryGroupDto.search || '', mode: 'insensitive' } }] },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      return this.prisma.group.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          created_at: true,
          updated_at: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByUserId(id: string): Promise<any> {
    try {
      const listGroup = await this.prisma.userOnGroup.findMany({
        where: { user_id: id },
        select: { group_id: true },
      });
      if (listGroup.length === 0) return [];
      const groups = await this.prisma.group.findMany({
        where: { id: { in: listGroup.map(group => group.group_id) } },
        select: {
          id: true,
          name: true,
          description: true,
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
      return groups;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      const { permissions, ...data } = updateGroupDto;
      const group = await this.prisma.group.update({ where: { id }, data: { ...data } });
      if (permissions && permissions.length > 0) {
        this.prisma.groupOnPermission.deleteMany({ where: { group_id: id } });
        this.prisma.groupOnPermission.createMany({
          data: permissions.map(permission => ({ group_id: id, permission_id: permission })),
        });
      }
      return group;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      return this.prisma.group.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
