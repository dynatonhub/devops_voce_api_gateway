import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';

export class RoleEntity {
  @ApiProperty({ required: true, description: 'Id da papel', type: String })
  id: string;
  @ApiProperty({ required: true, description: 'Nome', type: String })
  name: string;
  @ApiProperty({ required: false, description: 'Slug', type: String })
  slug?: string;
  @ApiProperty({ required: false, description: 'Permissões do papel', type: PermissionEntity, isArray: true })
  permissions?: PermissionEntity[];
  @ApiProperty({ required: false, description: 'Data da criação', type: Date })
  created_at?: Date;
}
