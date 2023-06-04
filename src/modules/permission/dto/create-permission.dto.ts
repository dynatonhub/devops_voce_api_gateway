import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Nome', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição', type: String })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Ação', type: String })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Entidade', type: String })
  @IsString()
  @IsNotEmpty()
  entity: string;
}
