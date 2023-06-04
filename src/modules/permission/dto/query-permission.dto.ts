import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryPermissionDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  search?: string;
}
