import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserJwtResponse } from './user-jwt.interface';
import { Sign } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUserById(userId: string) {
    return await this.userService.findById(userId);
  }

  async signUp(signupDto: SignupDto): Promise<User> {
    console.log('SignUpDto: ' + signupDto.email);
    return this.userService.create(signupDto);
  }

  async login(loginDto: LoginDto): Promise<UserJwtResponse> {
    const userResult = await this.userService.signIn(loginDto);

    if (!userResult) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const payload = { userResult };
    const accessToken = await this.jwtService.sign(payload);

    const signInResponse: UserJwtResponse = { user: userResult, accessToken };

    return signInResponse;
  }
}
