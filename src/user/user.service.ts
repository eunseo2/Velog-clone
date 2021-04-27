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

  async Update(Id: number, updateData: UpdateDto) {
    const updateUser = {
      displayName: updateData.displayName,
      intro: updateData.intro,
    };
    const user = await this.userRepository.update(Id, updateUser);
    console.log(user);
    return user;
  }
}
