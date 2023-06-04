import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordAccountDto {
  @ApiProperty({ description: 'first_name', type: String, required: true, example: 'rafael@email.com' })
  @IsEmail({}, { message: 'invalid email' })
  @IsNotEmpty()
  email: string;
}
