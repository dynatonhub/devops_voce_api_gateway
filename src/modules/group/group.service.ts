import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';
import { QueryGroupDto } from './dto/query-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}
  async create(createGroupDto: CreateGroupDto): Promise<any> {
    try {
      const { permissions, ...data } = createGroupDto;
      if (permissions.length === 0) throw new BadRequestException('Nenhuma permissão informada');
      data['permissions'] = permissions.map(permission => ({ permission_id: permission }));
      return this.groupRepository.create(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(queryGroupDto: QueryGroupDto): Promise<any> {
    try {
      const groups = await this.groupRepository.findAll(queryGroupDto);
      if (groups.length === 0) throw new BadRequestException('Nenhum grupo encontrado');
      return groups;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const group = await this.groupRepository.findById(id);
      if (!group) throw new BadRequestException('Nenhuma papel encontrado');
      return {
        ...group,
        permissions:
          group.permissions.length > 0
            ? group.permissions.map(permission => ({
                id: permission.permission?.id,
                name: permission.permission?.name,
              }))
            : [],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByUserId(id: string): Promise<any> {
    try {
      const groups = await this.groupRepository.findByUserId(id);
      if (groups.length === 0) return [];
      return groups.map(group => ({
        ...group,
        permissions:
          group.permissions.length > 0
            ? group.permissions.map(permission => ({
                id: permission.permission?.id,
                name: permission.permission?.name,
                scope: `${permission.permission?.entity}:${permission.permission?.action}`,
              }))
            : [],
      }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      const group = await this.groupRepository.findById(id);
      if (!group) throw new BadRequestException('Nenhum grupo encontrado');
      return this.groupRepository.update(id, updateGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const group = await this.groupRepository.findById(id);
      if (!group) throw new BadRequestException('Nenhum grupo encontrado');
      return this.groupRepository.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
