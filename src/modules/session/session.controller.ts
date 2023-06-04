import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
@ApiTags('Sessões')
@ApiBearerAuth('JWT')
@UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
@Controller('api/v1/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @ApiOperation({ summary: 'Lista todas as sessões' })
  @Permissions('session:read')
  @Get()
  findAll() {
    return this.sessionService.findAll();
  }
}
