import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository, PrismaService],
})
export class PermissionModule {}
