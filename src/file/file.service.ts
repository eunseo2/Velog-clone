import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';
import config from '../config';

const API_HOST = config.API_HOST;

type deleteProfile = {
  profile: string;
};

@Injectable()
export class FileService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async Update(Id: number, file: string): Promise<void> {
    const updateUser = {
      profile: `${API_HOST}/files/${file}`,
    };
    await this.userRepository.update(Id, updateUser);
  }

  async getFile(Id: number): Promise<string> {
    const user = await this.userRepository.findOne(Id);

    return user.profile;
  }

  async deleteProfile(id: number, deleteData: deleteProfile): Promise<void> {
    await this.userRepository.update(id, deleteData);
  }
}
