import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';

import config from './config';

const { SECRET_KEY, CLIENT_HOST, API_HOST } = config;

if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
  throw new Error('MISSING_ENVAR');
}

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async findUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }
}
