import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { ForgotPasswordAccountDto } from './dto/forgot-password-account.dto';
import { UpdatePasswordAccountDto } from './dto/update-password-account.dto';
// import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Contas')
@Controller('api/v1/')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Criar uma conta (aguardando serviço do usuário e mensageria)' })
  @Post('register')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @ApiOperation({ summary: 'Dados de perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Dados de perfil do usuário', type: UserEntity })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  // @SkipThrottle()
  // @Throttle(3, 60)
  @Get('profile')
  async getProfile(@Req() req: any): Promise<UserEntity> {
    return this.accountService.getProfile(req.user.sub);
  }

  @ApiOperation({ summary: 'Esqueceu a senha (aguardando serviço de mensageria)' })
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordAccountDto: ForgotPasswordAccountDto) {
    const { email } = forgotPasswordAccountDto;
    return this.accountService.forgotPassword(email);
  }

  @ApiOperation({ summary: 'Atualizar senha (aguardando serviço do usuário)' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  @Patch('update-password')
  updatePassword(@Req() req: any, @Body() updatePasswordAccountDto: UpdatePasswordAccountDto) {
    const { password } = updatePasswordAccountDto;
    return this.accountService.updatePassword(req.user.sub, password);
  }

  @ApiOperation({ summary: 'Encerrar a conta (aguardando serviço do usuário)' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  @Delete('delete-account')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
