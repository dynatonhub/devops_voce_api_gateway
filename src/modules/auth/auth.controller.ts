import { Controller, Post, Body, Headers, Req, Patch, Delete, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TokenEntity } from './entities/token.entity';
import { AuthGuard } from './guards/auth.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserEntity } from '../user/entities/user.entity';
@ApiTags('Autenticação')
@Controller('api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Fornece o token de authenticação' })
  @ApiResponse({ status: 200, description: 'Access Token', type: TokenEntity })
  @ApiBody({ description: 'Dados de login', type: LoginAuthDto })
  @Post('login')
  async logIn(@Body() loginAuthDto: LoginAuthDto, @Headers() headers: string): Promise<TokenEntity> {
    const userAgent = headers['user-agent'];
    return this.authService.signIn(loginAuthDto.email, loginAuthDto.password, userAgent);
  }

  @ApiOperation({ summary: 'Fornece o token de authenticação com o refresh-token' })
  @ApiResponse({ status: 200, description: 'Access Token', type: TokenEntity })
  @Patch('refresh-token')
  async refreshToken(@Headers('Authorization') authorization: string): Promise<TokenEntity> {
    const token = authorization.replace('Bearer ', '');
    return await this.authService.refreshToken(token);
  }

  @ApiOperation({ summary: 'Dados de perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Dados de perfil do usuário', type: UserEntity })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any): Promise<UserEntity> {
    return this.authService.getProfile(req.user.sub);
  }

  @ApiOperation({ summary: 'Encerra a sessão e invalida o token' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  @Delete('logout')
  async logOut(@Req() req: any, @Headers() headers: string) {
    const token = headers['authorization'].replace('Bearer ', '');
    return this.authService.logOut(req.user.sub, token);
  }
}
