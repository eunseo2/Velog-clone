import { IsString } from 'class-validator';

export class UpdateDto {
  @IsString()
  userID: string;
  @IsString()
  Intro: string;
}
