import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Usuários')
@ApiBearerAuth('JWT')
@Controller('api/v1/users')
@UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions('user:read')
  @Get()
  async findAll(@Query() data: any): Promise<any> {
    try {
      return this.userService.findAll(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Permissions('user:view')
  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Permissions('user:creare')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.created(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
