import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';

export class groupEntity {
  @ApiProperty({ required: true, description: 'Id da permissão', type: String })
  id: string;
  @ApiProperty({ required: true, description: 'Nome', type: String })
  name: string;
  @ApiProperty({ required: false, description: 'Descrição', type: String })
  description?: string;
  @ApiProperty({ required: false, description: 'Permissões do papel', type: PermissionEntity, isArray: true })
  permissions?: PermissionEntity;
  @ApiProperty({ required: false, description: 'Data da criação', type: Date })
  created_at?: Date;
}
