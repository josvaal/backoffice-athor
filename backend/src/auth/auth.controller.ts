import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';
import { UsersService } from 'src/users/users.service';
import { ApiResponse, JwtRequestPayload, JwtToken } from 'src/custom.types';
import { UserView } from 'src/users/dto/user-view.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ApiResponse<JwtToken>> {
    try {
      return {
        data: await this.authService.signIn(
          signInDto.email,
          signInDto.password,
        ),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() signUpDto: SignUpDto): Promise<ApiResponse<JwtToken>> {
    try {
      return {
        data: await this.authService.signUp(signUpDto),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: JwtRequestPayload,
  ): Promise<ApiResponse<UserView>> {
    try {
      return {
        data: await this.authService.profile(req),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }
}
