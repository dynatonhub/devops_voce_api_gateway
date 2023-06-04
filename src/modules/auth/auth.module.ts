import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RoleModule } from '../role/role.module';
import { GroupModule } from '../group/group.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    GroupModule,
    SessionModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_ACCESS_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
