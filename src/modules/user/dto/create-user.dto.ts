import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Primeiro nome', type: String, example: 'Rafael' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'Sobrenome', type: String, example: 'Araujo' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'email', type: String, example: 'rflaraujo@email.com' })
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

  @ApiProperty({ description: 'Id do papel', type: String, example: '5ca9bccc-bcdb-41f3-9599-e65a0a082e83' })
  @IsString()
  @IsNotEmpty()
  role_id: string;

  @ApiPropertyOptional({ description: 'CPF', type: String })
  @IsString()
  @IsOptional()
  cpf: string;

  @ApiPropertyOptional({ description: 'CPF', type: String })
  @IsString()
  @IsOptional()
  cnpj: string;
}
