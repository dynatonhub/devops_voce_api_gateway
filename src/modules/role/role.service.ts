import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  async findAll(): Promise<any> {
    try {
      const roles = await this.roleRepository.findAll();
      if (roles.length === 0) throw new BadRequestException('Nenhuma papel encontrado');
      return roles;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findById(id: string): Promise<any> {
    try {
      const role = await this.roleRepository.findById(id);
      if (!role) throw new BadRequestException('Nenhuma papel encontrado');
      return {
        ...role,
        permissions:
          role.permissions.length > 0
            ? role.permissions.map(permission => ({
                id: permission.permission?.id,
                name: permission.permission?.name,
                scope: `${permission.permission?.entity}:${permission.permission?.action}`,
              }))
            : [],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
