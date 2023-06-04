import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
@ApiTags('Papeis')
@ApiBearerAuth('JWT')
@UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
@Controller('api/v1/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @ApiOperation({ summary: 'Lista todos os papeis' })
  @ApiResponse({ status: 200, description: 'Lista todos os papeis', type: RoleEntity, isArray: true })
  @Permissions('role:read')
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: 'Informa detalhes dos papeis' })
  @ApiResponse({ status: 200, description: 'Detalhes do papel', type: RoleEntity })
  @Permissions('role:view')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }
}
