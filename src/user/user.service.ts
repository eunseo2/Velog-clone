import { Injectable } from '@nestjs/common';
import { UpdateDto } from 'src/auth/dto/update-user.dto';
import { UserRepository } from 'src/entities/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async userInfo(userId: number) {
    const user = await this.userRepository.findOne(userId);
    return user;
  }

  async Update(userId: number, updateData: UpdateDto) {
    const user = await this.userRepository.update(userId, updateData);
    return user;
  }
}
