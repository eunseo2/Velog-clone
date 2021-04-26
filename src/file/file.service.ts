import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';

@Injectable()
export class FileService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async Update(Id: number, file: string) {
    const updateUser = {
      profile: file,
    };
    await this.userRepository.update(Id, updateUser);
  }

  async getFile(Id: number) {
    const user = await this.userRepository.findOne(Id);

    return user.profile;
  }
}
