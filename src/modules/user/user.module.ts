import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { GroupModule } from '../group/group.module';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';

@Module({
  imports: [
    RoleModule,
    GroupModule,
    // ClientsModule.register([
    //   {
    //     name: 'USER_PACKAGE',
    //     transport: Transport.GRPC,
    //     options: {
    //       url: '0.0.0.0:9001',
    //       package: 'service',
    //       protoPath: 'src/modules/user/user.proto',
    //     },
    //   },
    // ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
