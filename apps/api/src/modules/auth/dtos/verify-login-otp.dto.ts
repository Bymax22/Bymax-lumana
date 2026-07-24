import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyLoginOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  token!: string;
}
