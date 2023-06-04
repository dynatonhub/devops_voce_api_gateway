import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  async findAll(queryPermissionDto: QueryPermissionDto): Promise<any> {
    try {
      const permissions = await this.permissionRepository.findAll(queryPermissionDto);
      if (permissions.length === 0) throw new BadRequestException('Nenhuma permissão encontrada');
      return permissions.map(({ ...permission }) => ({
        ...permission,
        scope: `${permission.action}:${permission.entity}`,
      }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async create(createPermissionDto: CreatePermissionDto): Promise<any> {
    try {
      return await this.permissionRepository.create(createPermissionDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
