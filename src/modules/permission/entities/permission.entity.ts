import { ApiProperty } from '@nestjs/swagger';

export class PermissionEntity {
  @ApiProperty({ required: true, description: 'Id da permissão', type: String })
  id: string;
  @ApiProperty({ required: true, description: 'Nome', type: String })
  name: string;
  @ApiProperty({ required: false, description: 'Slug', type: String })
  slug: string;
  @ApiProperty({ required: false, description: 'Descrição', type: String })
  description?: string;
  @ApiProperty({ required: false, description: 'Escopo', type: String })
  scope?: string;
  @ApiProperty({ required: false, description: 'Ação', type: String })
  action?: string;
  @ApiProperty({ required: false, description: 'Entidade', type: String })
  entity?: string;
  @ApiProperty({ required: false, description: 'Data da criação', type: Date })
  created_at?: Date;
}
