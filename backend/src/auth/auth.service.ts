import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { UserSignupDto } from "src/users/dto/user-signup.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import {
	ApiResponse,
	JwtPayload,
	JwtRequestPayload,
	JwtToken,
} from "src/custom.types";
import { UserView } from "src/users/dto/user-view.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private prismaService: PrismaService,
		private jwtService: JwtService,
	) {}

	async signIn(email: string, pass: string): Promise<JwtToken> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new NotFoundException(
				"El usuario con este correo no se encuentra registrado",
			);
		}

		const isMatch = await bcrypt.compare(pass, user?.password as string);
		if (!isMatch) {
			throw new UnauthorizedException();
		}

		const payload: JwtPayload = {
			sub: user?.id.toString() as string,
			user: user as User,
		};

		return {
			access_token: await this.jwtService.signAsync(
				{
					...payload,
				},
				{
					expiresIn: "15m",
				},
			),
			refresh_token: await this.jwtService.signAsync(
				{ sub: user?.id },
				{ expiresIn: "7d" },
			),
		};
	}

	async signUp(userDto: UserSignupDto): Promise<JwtToken> {
		const user = await this.prismaService.$transaction(async (prisma) => {
			const userCreated = await this.usersService.create(userDto);
			if (!userCreated) {
				throw new InternalServerErrorException("Error al crear el usuario");
			}
			const roleUser = await this.prismaService.userRole.create({
				data: {
					//TODO: El rol de usuario siempre tiene que tener el ID "1"
					roleId: 1,
					userId: userCreated.id,
				},
			});

			if (!roleUser) {
				throw new InternalServerErrorException("Error al asignar el rol");
			}
			return userCreated;
		});

		const payload: JwtPayload = {
			sub: user.id.toString() as string,
			user: user,
		};

		return {
			access_token: await this.jwtService.signAsync(
				{
					...payload,
				},
				{
					expiresIn: "15m",
				},
			),
			refresh_token: await this.jwtService.signAsync(
				{ sub: user?.id },
				{ expiresIn: "7d" },
			),
		};
	}

	async profile(request: JwtRequestPayload): Promise<UserView> {
		const userJwt: User = request.user.user;
		const userDb: User | null = await this.usersService.findById(userJwt.id);

		if (!userDb) {
			throw new NotFoundException(
				`El usuario con el id #${userJwt.id} no existe`,
			);
		}
		const { password, ...userView } = userDb;

		return userView;
	}

	async update(request: JwtRequestPayload, updateUserDto: UpdateUserDto) {
		const userJwt: User = request.user.user;
		const userDb: User | null = await this.usersService.findById(userJwt.id);

		if (!hasPassed15Days(userDb.updatedAt)) {
			throw new BadRequestException(
				`Debes esperar ${daysUntil15Days(userDb.updatedAt)} días para poder actualizar tu perfil`,
			);
		}

		if (!userDb) {
			throw new NotFoundException(
				`El usuario con el id #${userJwt.id} no existe`,
			);
		}

		if (updateUserDto["password"]) {
			throw new BadRequestException("No se permite actualizar la contraseña");
		}

		if (updateUserDto["email"]) {
			throw new BadRequestException("No se permite actualizar el correo");
		}

		const user = await this.prismaService.user.update({
			where: {
				id: userJwt.id,
			},
			data: updateUserDto,
		});

		if (!user) {
			throw new NotFoundException(
				`El usuario con el id #${userJwt.id} no existe`,
			);
		}

		return user;
	}
}

function hasPassed15Days(date1: Date): boolean {
	const today: Date = new Date();
	// Normalizamos ambas fechas para comparar solo las fechas, sin la hora
	const normalizedToday = new Date(today.setHours(0, 0, 0, 0));
	const normalizedDate1 = new Date(date1.setHours(0, 0, 0, 0));

	const diffInMilliseconds = Math.abs(
		normalizedToday.getTime() - normalizedDate1.getTime(),
	);
	const daysInMilliseconds = 15 * 24 * 60 * 60 * 1000; // 15 días en milisegundos

	return diffInMilliseconds >= daysInMilliseconds;
}

function daysUntil15Days(date1: Date): number {
	const today: Date = new Date(); // Fecha de hoy
	const normalizedToday = new Date(today.setHours(0, 0, 0, 0));
	const normalizedDate1 = new Date(date1.setHours(0, 0, 0, 0));

	const diffInMilliseconds =
		normalizedToday.getTime() - normalizedDate1.getTime();
	const daysPassed = diffInMilliseconds / (24 * 60 * 60 * 1000); // Convertimos de milisegundos a días

	// Si ya han pasado 15 días o más, retornamos 0 (no se necesita esperar más)
	if (daysPassed >= 15) {
		return 0;
	}

	// Si no han pasado 15 días, calculamos cuántos días faltan
	const daysToWait = 15 - daysPassed;
	return Math.ceil(daysToWait); // Usamos Math.ceil para redondear hacia arriba
}
