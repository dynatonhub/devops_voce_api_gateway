import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(createSessionDto: CreateSessionDto) {
    try {
      return this.prisma.session.create({
        data: createSessionDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    try {
      return this.prisma.session.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(user_id: string) {
    try {
      return this.prisma.session.updateMany({
        where: { user_id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
