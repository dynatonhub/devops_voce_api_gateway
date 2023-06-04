import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionRepository } from './session.repository';
import * as useragent from 'useragent';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}
  create(createSessionDto: CreateSessionDto) {
    const user_agent = useragent.parse(createSessionDto.user_agent).family;
    return this.sessionRepository.create({
      ...createSessionDto,
      user_agent,
    });
  }

  findAll() {
    return this.sessionRepository.findAll();
  }

  remove(user_id: string) {
    return this.sessionRepository.remove(user_id);
  }
}
