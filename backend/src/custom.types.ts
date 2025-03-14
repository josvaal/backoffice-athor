import { User } from '@prisma/client';

export interface ApiResponse {
  data: any | null;
  error: Error | null;
}

export interface JwtRequestPayload extends ParameterDecorator {
  user: JwtPayload;
}

export interface JwtPayload {
  sub: string;
  user: User;
}

export interface JwtToken {
  access_token: string;
}
