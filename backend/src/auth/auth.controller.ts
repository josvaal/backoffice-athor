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
import { UsersService } from 'src/users/users.service';
import { ApiResponse, JwtRequestPayload, JwtToken } from 'src/custom.types';
import { UserView } from 'src/users/dto/user-view.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ApiResponse> {
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
  async register(@Body() signUpDto: SignUpDto): Promise<ApiResponse> {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Request() req: JwtRequestPayload): Promise<ApiResponse> {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Solo se puede actualizar perfil cada 15 dias',
  })
  @Put('me')
  async updateProfile(
    @Request() req: JwtRequestPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.authService.update(req, updateUserDto),
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
