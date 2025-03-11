import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { SitemarkIcon } from "./components/custom-icons";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../global/IsAuthenticated";
import { Alert, CircularProgress } from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignSelf: "center",
	width: "100%",
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: "auto",
	[theme.breakpoints.up("sm")]: {
		maxWidth: "450px",
	},
	boxShadow:
		"hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
	...theme.applyStyles("dark", {
		boxShadow:
			"hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
	}),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props: { disableCustomTheme?: boolean }) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		shouldUseNativeValidation: true,
	});
	const [formData, setFormData] = React.useState();
	const navigate = useNavigate();
	const { isAuthenticated, setAuthenticated } = useAuthStore();

	const ba_url = import.meta.env.VITE_BA_URL;
	const { isLoading, isError, error, data, refetch } = useQuery(
		"auth",
		() =>
			fetch(`${ba_url}/auth/login`, {
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
		console.log(formDataProp);
		setFormData(formDataProp);
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
			<SignInContainer direction="column" justifyContent="space-between">
				<Card variant="outlined">
					<SitemarkIcon />
					<Typography
						component="h1"
						variant="h4"
						sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
					>
						Inicio de sesión
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
								helperText={errors.email?.message as React.ReactNode}
								id="email"
								type="email"
								name="email"
								placeholder="tu@correo.com"
								autoComplete="email"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={errors.email ? "error" : "primary"}
							/>
						</FormControl>
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
								helperText={errors.password?.message as React.ReactNode}
								name="password"
								placeholder="••••••"
								type="password"
								id="password"
								autoComplete="current-password"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={errors.password ? "error" : "primary"}
							/>
						</FormControl>
						{isError ? <Alert severity="error">{error.message}</Alert> : null}
						<Button
							disabled={isLoading}
							style={{ marginTop: 5 }}
							type="submit"
							fullWidth
							variant="contained"
							formNoValidate
						>
							Iniciar Sesión
						</Button>
						<Link
							href="/auth/sign-up"
							sx={{ alignSelf: "center" }}
							variant="body2"
						>
							¿No tienes una cuenta?
						</Link>
					</Box>
				</Card>
			</SignInContainer>
		</>
	);
}
