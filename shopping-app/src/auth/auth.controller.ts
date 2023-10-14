import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { log } from 'console';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  signIn(@Body() signIn: SignInDto) {
    // log(signIn);
    return this.authService.signIn(signIn);
  }

  @Post('sign-up')
  @ApiBody({ type: CreateUserDto })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('refresh-token')
  @ApiBody({ type: RefreshTokenDto })
  refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }
}
