import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async refreshToken(tokenDto: RefreshTokenDto) {
    const user = await this.userModel
      .findOne({ email: tokenDto.email })
      .select('+refresh_token');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.refresh_token !== tokenDto.refreshToken) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const verifyToken = this.jwtService.verify(tokenDto.refreshToken, {
      secret: 'secret',
    });
    if (!verifyToken) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const payload_access = { sub: user.id, username: user.email };
    const access_token = this.jwtService.sign(payload_access);
    return {
      access_token: access_token,
      expires_in: '1d',
      refresh_token: tokenDto.refreshToken,
      refresh_expires_in: '7d',
      user: user,
    };
  }
  async signIn(signInDto: SignInDto) {
    const user = await this.userModel
      .findOne({ email: signInDto.email })
      .select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new NotFoundException('Invalid credentials');
    }
    const payload_access = { sub: user.id, username: user.email };
    const payload_refresh = { sub: user.id, username: user.email };

    const access_token = this.jwtService.sign(payload_access);
    const refresh_token = this.jwtService.sign(payload_refresh);

    user.refresh_token = refresh_token;
    await user.save();

    return {
      access_token: access_token,
      expires_in: '1d',
      refresh_token: refresh_token,
      refresh_expires_in: '7d',
      user: user,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new ConflictException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;
    const newUser = await this.userModel.create(createUserDto);

    const payload_access = { sub: newUser.id, newUsername: newUser.email };
    const payload_refresh = { sub: newUser.id, newUsername: newUser.email };

    const access_token = this.jwtService.sign(payload_access);
    const refresh_token = this.jwtService.sign(payload_refresh);

    newUser.refresh_token = refresh_token;
    await newUser.save();

    newUser.password = undefined;
    return {
      access_token: access_token,
      expires_in: '1d',
      refresh_token: refresh_token,
      refresh_expires_in: '7d',
      user: newUser,
    };
  }
}
