import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    } else {
      let existsUser = null;
      const name = req.user.name;
      existsUser = await this.userRepository.findOne({ name: name });
      console.log(existsUser);
      if (existsUser) {
        console.log('이미 저장했습니다');
        return req.user;
      } else {
        return await this.userRepository.save(req.user);
      }
    }
  }
}
