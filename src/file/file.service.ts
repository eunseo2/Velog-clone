import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';
import config from '../config';

const API_HOST = config.API_HOST;

@Injectable()
export class FileService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async Update(Id: number, file: string) {
    const updateUser = {
      profile: `${API_HOST}/files/${file}`,
    };
    await this.userRepository.update(Id, updateUser);
  }

  async getFile(Id: number) {
    const user = await this.userRepository.findOne(Id);

    return user.profile;
  }
}
