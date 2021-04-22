import { IsString } from 'class-validator';

export class UpdateDto {
  @IsString()
  profile: string;
  @IsString()
  userID: string;
  @IsString()
  Intro: string;
}
