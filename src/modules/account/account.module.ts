import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UserService } from '../user/user.service';
import { RoleModule } from '../role/role.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [RoleModule, GroupModule],
  controllers: [AccountController],
  providers: [AccountService, UserService],
})
export class AccountModule {}
