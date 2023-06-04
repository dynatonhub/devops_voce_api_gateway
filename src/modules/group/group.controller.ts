import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionEntity } from '../permission/entities/permission.entity';
import { QueryGroupDto } from './dto/query-group.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
@ApiTags('Grupos')
@ApiBearerAuth('JWT')
@Controller('api/v1/groups')
@UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Criar novo grupo' })
  @ApiCreatedResponse({ description: 'Grupo criado com sucesso !' })
  @Permissions('group:create')
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @ApiOperation({ summary: 'Lista todos os grupos' })
  @ApiResponse({ description: 'Lista de grupos', type: PermissionEntity, isArray: true })
  @Permissions('group:read')
  @Get()
  findAll(@Query() queryGroupDto: QueryGroupDto) {
    return this.groupService.findAll(queryGroupDto);
  }

  @ApiOperation({ summary: 'Informa detalhes do grupo' })
  @ApiResponse({ description: 'Detalhes do grupo', type: PermissionEntity })
  @Permissions('group:view')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @ApiOperation({ summary: 'Atualiza dados do grupo' })
  @ApiResponse({ description: 'Grupo atualizado com sucesso!' })
  @Permissions('group:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @ApiOperation({ summary: 'Deletar grupo' })
  @ApiResponse({ description: 'Grupo deletado com sucesso!' })
  @Permissions('group:delete')
  @ApiOperation({ summary: 'Deleta o grupo' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
