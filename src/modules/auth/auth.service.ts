import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SessionService } from '../session/session.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}
  async signIn(email: string, password: string, userAgent: string): Promise<any> {
    try {
      const { password: passwordUser, ...user } = await this.userService.findByEmail(email);
      if (!user) throw new UnauthorizedException();
      const isMatch = await compareSync(password, passwordUser);
      if (!isMatch) throw new UnauthorizedException();
      await this.cacheManager.set(user.id, user.permissions, 60 * 60 * 24);
      const createSession = await this.sessionService.create({ user_id: user.id, user_agent: userAgent });
      if (!createSession) throw new UnauthorizedException();
      const tokens = await this.generateToken(user.id);
      return { ...tokens };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async generateToken(user: string): Promise<any> {
    const payload = { sub: user };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync({ ...payload, type: 'refresh' }, { expiresIn: '7d' }),
    };
  }
  async refreshToken(refresh_token: string): Promise<any> {
    const payload = this.jwtService.verify(refresh_token);
    if (payload.type !== 'refresh') throw new UnauthorizedException();
    const user = await this.userService.findById(payload.user_id);
    const permissions = await this.userService.getUserPermissions(user.id);
    await this.cacheManager.set(user.id, permissions, 60 * 60 * 24);
    return this.generateToken(user.id);
  }
  async getProfile(user_id: string): Promise<any> {
    try {
      const user = await this.userService.findById(user_id);
      if (!user) throw new UnauthorizedException();
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async logOut(user_id: string, token: string): Promise<any> {
    try {
      //get tokens from black list
      const blackListToken: string[] | undefined | null = await this.cacheManager.get('black_list_token');
      //add token to black list
      await this.cacheManager.set(
        'black_list_token',
        blackListToken ? [...blackListToken, token] : [token],
        60 * 60 * 1000 * 24,
      );
      //remove user from cache
      await this.cacheManager.del(user_id);
      //remove session
      await this.sessionService.remove(user_id);
      return { message: 'Logout successfully' };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
