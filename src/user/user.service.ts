import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { LoginResponseDto } from 'src/auth/dto/loginResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async create(signupDto: SignupDto): Promise<User> {
    const user = new User();
    user.username = signupDto.username;
    user.email = signupDto.email;
    user.salt = await bcrypt.genSalt(); // Генерация соли
    user.password = await bcrypt.hash(signupDto.password, user.salt); // Хэширование пароля
    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async signIn(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && user.validatePassword(password)) {
      const userResponse = new LoginResponseDto();

      userResponse.username = user.username;
      userResponse.email = user.email;
      return userResponse;
    } else {
      return null;
    }
  }
}
