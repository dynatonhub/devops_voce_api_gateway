import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'email', type: String, required: true, example: 'rafael@email.com' })
  @IsEmail({}, { message: 'Email invalido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password', type: String, example: 'Mudar@123' })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/, { message: 'password too weak' })
  password: string;
}
