import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { ApiResponse, JwtPayload, JwtToken } from "src/custom.types";
import { UsersService } from "src/users/users.service";

@Injectable()
export class TokenService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async verifyToken(token: string) {
		if (!token) {
			throw new BadRequestException("No se proveeyó un token");
		}
		return await this.jwtService.verifyAsync<JwtPayload>(token);
	}

	async refreshToken(refreshToken: string) {
		console.log(refreshToken);
		const decoded = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
		console.log(decoded);
		const user = await this.usersService.findById(Number(decoded.sub));

		if (!user) {
			throw new UnauthorizedException("Usuario no encontrado");
		}

		const newPayload: JwtPayload = { sub: user.id.toString(), user };

		return {
			access_token: await this.jwtService.signAsync(
				{
					...newPayload,
				},
				{
					expiresIn: "15m",
				},
			),
			refresh_token: await this.jwtService.signAsync(
				{ sub: user.id },
				{ expiresIn: "7d" },
			),
		};
	}
}
