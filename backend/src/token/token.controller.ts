import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  verify(@Headers('Authorization') auth: string) {
    const token = auth.split(' ')[1];
    return this.tokenService.verifyToken(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Headers('Authorization') auth: string) {
    const token = auth.split(' ')[1];
    return this.tokenService.refreshToken(token);
  }
}
