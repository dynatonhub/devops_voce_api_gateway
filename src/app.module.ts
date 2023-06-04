import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import * as redisStore from 'cache-manager-redis-store';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { GroupModule } from './modules/group/group.module';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AccountModule } from './modules/account/account.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { DocumentModule } from './modules/document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLING_TIME_WINDOW,
      limit: +process.env.THROTTLING_MAX_REQUESTS,
    }),
    AuthModule,
    PermissionModule,
    UserModule,
    RoleModule,
    GroupModule,
    SessionModule,
    AccountModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
