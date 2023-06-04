import { ApiProperty } from '@nestjs/swagger';

export class TokenEntity {
  @ApiProperty({ required: true, description: 'Acess token', type: String })
  access_token: string;
  @ApiProperty({ required: true, description: 'Refresh token', type: String })
  refresh_token: string;
}
