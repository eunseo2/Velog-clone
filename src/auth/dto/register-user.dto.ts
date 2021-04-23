import { IsEnum, IsString } from 'class-validator';

export enum Provider {
  google = 'google',
  velog = 'velog',
}

export class RegisterDto {
  @IsEnum(Provider, { each: true })
  provider: Provider;
  @IsString()
  email: string;
  @IsString()
  username: string;
  @IsString()
  displayName: string;
  @IsString()
  intro: string;
}
