import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, PrismaService],
  exports: [SessionService],
})
export class SessionModule {}
