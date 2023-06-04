import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
  constructor(private readonly userService: UserService) {}
  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account' + createAccountDto;
  }

  async forgotPassword(email: string) {
    try {
      const { id } = await this.userService.findByEmail(email);
      if (!id) throw new BadRequestException('Email não encontrado');
      return await this.userService.forgotPassword(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  updatePassword(id: string, password: string) {
    return `This action updates a #${id} account`;
    +password;
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
    +updateAccountDto;
  }

  remove(id: string) {
    return `This action removes a #${id} account`;
  }

  async getProfile(user_id: string): Promise<any> {
    try {
      const user = await this.userService.findById(user_id);
      if (!user) throw new BadRequestException();
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
