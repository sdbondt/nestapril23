/* eslint-disable prettier/prettier */
import { IsEmail, Length, Matches } from 'class-validator';
import { passwordRegex } from 'src/constants/regex';

export class SignupDto {
  @IsEmail()
  email: string;

  @Length(2, 20)
  username: string;

  @Matches(passwordRegex)
  password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    password: string;
}
