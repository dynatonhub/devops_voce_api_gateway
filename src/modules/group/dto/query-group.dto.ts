import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryGroupDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  search: string;
}
