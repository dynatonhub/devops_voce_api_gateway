import { ApiProperty } from '@nestjs/swagger';
import { groupEntity } from 'src/modules/group/entities/group.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
export class UserEntity {
  @ApiProperty({ required: true, description: 'Id da usuário', type: String })
  id: string;
  @ApiProperty({ required: true, description: 'Primeiro nome', type: String })
  first_name: string;
  @ApiProperty({ required: true, description: 'So nome', type: String })
  last_name: string;
  @ApiProperty({ required: true, description: 'Email', type: String })
  email: string;
  @ApiProperty({ required: false, description: 'Papel', type: RoleEntity, isArray: false })
  role?: RoleEntity;
  @ApiProperty({ required: false, description: 'Grupos', type: groupEntity, isArray: true })
  groups?: groupEntity[];
  @ApiProperty({ required: false, description: 'Permissoes', type: String, isArray: true })
  permissions?: string[];
}
