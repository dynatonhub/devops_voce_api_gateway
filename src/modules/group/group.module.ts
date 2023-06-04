import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, PrismaService],
  exports: [GroupService],
})
export class GroupModule {}
