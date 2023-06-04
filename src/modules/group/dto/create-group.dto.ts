import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: 'Nome', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Permissions', type: String, isArray: true })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];

  @ApiPropertyOptional({ description: 'Descrição', type: String })
  @IsString()
  @IsOptional()
  description: string;
}
