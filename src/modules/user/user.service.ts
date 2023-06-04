import { BadRequestException, InternalServerErrorException, OnModuleInit, Injectable } from '@nestjs/common';
import { RoleService } from '../role/role.service';
import { UserEntity } from './entities/user.entity';
import { GroupService } from '../group/group.service';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly roleService: RoleService, private readonly groupService: GroupService) {}
  @Client({
    transport: Transport.GRPC,
    options: {
      url: `${process.env.USER_SERVICE_URL}`,
      package: 'service',
      protoPath: 'src/modules/user/user.proto',
    },
  })
  private client: ClientGrpc;
  private userServiceGRPC: any;
  onModuleInit() {
    this.userServiceGRPC = this.client.getService<any>('UserService');
  }
  private readonly users = [
    {
      id: '23b88f67-28c9-463e-9d6a-3095820b1070',
      first_name: 'Rafael',
      last_name: 'Araujo',
      password: '$2b$10$GTQo7hEwPnxYRk6LEpd/S.Evl.yUfGXCqVtpb5n/Kgw/2kxnHWT32',
      email: 'rafael@email.com',
      role_id: '5ca9bccc-bcdb-41f3-9599-e65a0a082e83',
    },
  ];
  async findAll(query: any): Promise<any> {
    try {
      console.log(process.env.USER_SERVICE_URL);
      return this.userServiceGRPC.listUsers({ ...query });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao obter usuários');
    }
  }
  async findByEmail(email: string): Promise<any | undefined> {
    const { role_id, ...user } = this.users.find(user => user.email === email);
    const role = await this.roleService.findById(role_id);
    const groups = await this.groupService.findByUserId(user.id);
    const permissions = await this.getUserPermissions(user.id);
    return {
      ...user,
      role: { id: role.id, name: role.name },
      groups: groups.map(({ id, name }) => ({ id, name })),
      permissions,
    };
  }
  async findById(id: string): Promise<UserEntity | undefined> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role_id, password, ...user } = this.users.find(user => user.id === id);
      const role = await this.roleService.findById(role_id);
      const groups = await this.groupService.findByUserId(id);
      const permissions = await this.getUserPermissions(id);
      return {
        ...user,
        role: { id: role.id, name: role.name },
        groups: groups.map(({ id, name }) => ({ id, name })),
        permissions,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async forgotPassword(id: string): Promise<any> {
    try {
      return id;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getUserPermissions(id: string): Promise<any> {
    try {
      const { role_id } = this.users.find(user => user.id === id);
      const { permissions: permissionRole } = await this.roleService.findById(role_id);
      const groups = await this.groupService.findByUserId(id);
      const permissionsGroup = groups.map(group => group.permissions.map(permission => permission.scope));
      const permissions = [...permissionRole.map(permission => permission.scope), permissionsGroup].flat(2);
      return permissions;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async created(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { cnpj, cpf, ...data } = createUserDto;
      if (cnpj) data['judicial'] = { cnpj };
      if (cpf) data['fisical'] = { cpf };
      return this.userServiceGRPC.create({ ...data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
