import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionEntity } from './entities/permission.entity';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
@ApiTags('Permissões')
@ApiBearerAuth('JWT')
@Controller('api/v1/permissions')
@UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Lista todas as permissões do sistema' })
  @ApiResponse({ description: 'Lista de permissões', type: PermissionEntity, isArray: true })
  @Permissions('permission:read')
  @Get()
  async findAll(@Query() queryPermissionDto: QueryPermissionDto): Promise<PermissionEntity[]> {
    return this.permissionService.findAll(queryPermissionDto);
  }

  @ApiOperation({ summary: 'Criar nova permissão' })
  @ApiCreatedResponse({ description: 'Grupo criado com sucesso !' })
  @Permissions('permission:create')
  @Post()
  create(@Body() createGroupDto: CreatePermissionDto) {
    return this.permissionService.create(createGroupDto);
  }
}
