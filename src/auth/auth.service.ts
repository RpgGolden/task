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

  //Todo: добавить куки, которые будут сохранять логин и пароль юзера

  /**
   * Logs in a user with the provided login credentials.
   *
   * @param {LoginDto} loginDto - The login credentials of the user.
   * @return {Promise<UserJwtResponse>} - The response containing the user information and access token.
   * @throws {UnauthorizedException} - If the login credentials are invalid.
   */
  async login(loginDto: LoginDto): Promise<UserJwtResponse> {
    try {
      const user = await this.userService.findByEmail(loginDto.email);

      console.log('Provided email:', loginDto.email);
      console.log('Provided password:', loginDto.password);

      if (!user || !(await user.validatePassword(loginDto.password))) {
        console.log('Invalid Credentials!');
        throw new UnauthorizedException('Invalid Credentials!');
      }

      const payload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      //singInResponse include: id, username and email, without password and salt
      const signInResponse: UserJwtResponse = {
        user: {
          username: user.username,
          email: user.email,
        },
        accessToken,
      };
      return signInResponse;
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid Credentials!');
    }
  }
}
