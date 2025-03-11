import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { SitemarkIcon } from "./components/custom-icons";
import { useForm } from "react-hook-form";
import { useState, type ReactNode } from "react";
import { Alert, CircularProgress, Grid2 as Grid } from "@mui/material";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../../global/IsAuthenticated";

const Card = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignSelf: "center",
	width: "100%",
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: "auto",
	[theme.breakpoints.up("sm")]: {
		maxWidth: "550px",
	},
	boxShadow:
		"hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
	...theme.applyStyles("dark", {
		boxShadow:
			"hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
	}),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
	height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
	minHeight: "100%",
	padding: theme.spacing(2),
	[theme.breakpoints.up("sm")]: {
		padding: theme.spacing(4),
	},
	"&::before": {
		content: '""',
		display: "block",
		position: "absolute",
		zIndex: -1,
		inset: 0,
		backgroundImage:
			"radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
		backgroundRepeat: "no-repeat",
		...theme.applyStyles("dark", {
			backgroundImage:
				"radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
		}),
	},
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		shouldUseNativeValidation: true,
	});
	const [formData, setFormData] = useState();
	const navigate = useNavigate();
	const { isAuthenticated, setAuthenticated } = useAuthStore();

	const ba_url = import.meta.env.VITE_BA_URL;
	const { isLoading, isError, error, data, refetch } = useQuery(
		"auth",
		() =>
			fetch(`${ba_url}/auth/register`, {
				method: "POST",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.error) {
						throw data.error;
					}
					localStorage.setItem("access_token", data.data.access_token);
					localStorage.setItem("refresh_token", data.data.refresh_token);
					// console.log(data);

					toast.success("Éxito al registrarte");
					setAuthenticated(true);
					navigate("/");
				})
				.catch((err) => {
					throw err;
				}),
		{
			enabled: false,
		},
	);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onSubmit = async (formDataProp: any) => {
		const { verify_password, ...restData } = formDataProp;
		console.log(restData);
		setFormData(restData);
		// TIMEOUT para que se llegue a actualizar el setFormData
		setTimeout(async () => {
			await refetch();
		}, 60);
	};

	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<>
			<CssBaseline enableColorScheme />
			<SignUpContainer direction="column" justifyContent="space-between">
				<Card variant="outlined">
					<SitemarkIcon />
					<Typography
						component="h1"
						variant="h4"
						sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
					>
						Registrarme
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							gap: 2,
						}}
					>
						<Grid container spacing={2}>
							<Grid size={6}>
								<FormControl>
									<FormLabel htmlFor="email">Correo</FormLabel>
									<TextField
										{...register("email", {
											required: "Ingrese su correo",
											validate: (value) =>
												value.includes("@") ||
												'Un correo incluye un "@" como simbolo',
										})}
										error={!!errors.email}
										helperText={errors.email?.message as ReactNode}
										type="email"
										placeholder="your@email.com"
										autoFocus
										required
										fullWidth
										variant="outlined"
										color={errors.email ? "error" : "primary"}
									/>
								</FormControl>
							</Grid>
							<Grid size={6}>
								<FormControl>
									<FormLabel htmlFor="password">Contraseña</FormLabel>
									<TextField
										{...register("password", {
											required: "Ingrese su contraseña",
											minLength: {
												value: 8,
												message: "Mínimo 8 carácteres",
											},
										})}
										error={!!errors.password}
										helperText={errors.password?.message as ReactNode}
										placeholder="••••••"
										type="password"
										autoFocus
										required
										fullWidth
										variant="outlined"
										color={errors.password ? "error" : "primary"}
									/>
								</FormControl>
							</Grid>
							<Grid size={6}>
								<FormControl>
									<FormLabel htmlFor="verify_password">
										Verificar contraseña
									</FormLabel>
									<TextField
										{...register("verify_password", {
											required: "Vuelva a ingresar su contraseña",
											validate: (val: string) => {
												if (watch("password") !== val) {
													return "Las contraseñas no coinciden";
												}
											},
										})}
										error={!!errors.verify_password}
										helperText={errors.verify_password?.message as ReactNode}
										placeholder="••••••"
										type="password"
										autoFocus
										required
										fullWidth
										variant="outlined"
										color={errors.verify_password ? "error" : "primary"}
									/>
								</FormControl>
							</Grid>
							<Grid size={6}>
								<FormControl>
									<FormLabel htmlFor="name">Nombres</FormLabel>
									<TextField
										{...register("name", {
											required: "Ingrese sus nombres",
										})}
										error={!!errors.name}
										helperText={errors.name?.message as ReactNode}
										placeholder="Juan"
										autoFocus
										required
										fullWidth
										variant="outlined"
										color={errors.name ? "error" : "primary"}
									/>
								</FormControl>
							</Grid>
							<Grid size={6}>
								<FormControl>
									<FormLabel htmlFor="lastname">Apellidos</FormLabel>
									<TextField
										{...register("lastname", {
											required: "Ingrese sus nombres",
										})}
										error={!!errors.lastname}
										helperText={errors.lastname?.message as ReactNode}
										placeholder="Perez"
										autoFocus
										required
										fullWidth
										variant="outlined"
										color={errors.lastname ? "error" : "primary"}
									/>
								</FormControl>
							</Grid>
						</Grid>
						{isError ? <Alert severity="error">{error.message}</Alert> : null}
						<Button
							disabled={isLoading}
							style={{ marginTop: 5 }}
							type="submit"
							fullWidth
							variant="contained"
							formNoValidate
						>
							Registrarme
						</Button>
					</Box>
				</Card>
			</SignUpContainer>
		</>
	);
}
