import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from 'src/dtos/authDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<string> {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<string> {
    return this.authService.login(body);
  }
}
