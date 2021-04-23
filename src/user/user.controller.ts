import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';

import { UpdateDto } from 'src/auth/dto/update-user.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  async userInfo(@Param('id') userId: number) {
    const user = await this.userService.userInfo(userId);
    if (!user) {
      throw new NotFoundException(`user with ID ${userId} not found`);
    }
    return user;
  }

  @Patch(':id')
  async patch(@Param('id') Id: number, @Body() updateData: UpdateDto) {
    await this.userService.Update(Id, updateData);
    return { statusCode: 200 };
  }
}
