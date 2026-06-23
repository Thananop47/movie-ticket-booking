import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: Partial<UserEntity>; token: string }> {
    const existing = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existing) throw new ConflictException('Email already registered');
    const user = this.userRepository.create({
      ...registerDto,
      role: UserRole.USER,
    });
    await this.userRepository.save(user);

    const token = this.signToken(user);
    const { password, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Partial<UserEntity>; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user || !(await user.validatePassword(loginDto.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) throw new UnauthorizedException('Account is disabled');
    const token = this.signToken(user);
    const { password, ...safeUser } = user;
    return { user: safeUser, token };
  }

  private signToken(user: UserEntity): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
