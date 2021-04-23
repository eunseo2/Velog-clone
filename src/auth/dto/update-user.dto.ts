import { IsString } from 'class-validator';

export class UpdateDto {
  @IsString()
  displayName: string;
  @IsString()
  intro: string;
}
