import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserJwtResponse } from './user-jwt.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<User> {
    return this.authService.signUp(signupDto);
  }
  @Put('login')
  async login(@Body() loginDto: LoginDto): Promise<UserJwtResponse> {
    return this.authService.login(loginDto);
  }
  @Post('validate')
  async validate(@Req() req: Request, @Res() res: Response) {
    const token = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.authService.validateUser(token);
    if (user) {
      return res.json({ valid: true }); // Возвращаем true
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token');
    return res.json({ success: true });
  }
}
