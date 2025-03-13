import { ArrowBack } from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	FormControl,
	FormLabel,
	Grid2,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { type ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { profilePutData } from "./api/profileFetchData";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../../global/IsAuthenticated";
import { refreshToken } from "../../utils/retrieve_token";

interface ProfileEditParams {
	name: string;
	lastname: string;
	username: string;
	handleBackEdit: () => void;
}

export default function ProfileEdit({
	name,
	lastname,
	username,
	handleBackEdit,
}: ProfileEditParams) {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		shouldUseNativeValidation: true,
	});

	const [formData, setFormData] = useState({
		name,
		lastname,
		username,
	});

	const { setAuthenticated } = useAuthStore();

	const handleLogout = () => {
		console.log("Cerrando sesión...");
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		toast.success("Cerrando sesión...");
		setAuthenticated(false);
	};

	const { isLoading, isError, error, refetch } = useQuery(
		["update-profile"],
		() =>
			profilePutData({
				handleLogout,
				handleBackEdit,
				bodyData: formData,
			}),
		{
			onError: async (err: Error) => {
				console.log(err);

				if (err.message.includes("Debes esperar")) {
					return;
				}
				const result = await refreshToken();
				// console.log(result);
				if (result) {
					refetch();
				} else {
					handleLogout();
				}
				toast.error(err.message);
			},
			enabled: false,
			// Para que no haga refetching
			refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onSubmit = async (formDataProp: any) => {
		setFormData(formDataProp);
		setTimeout(async () => {
			await refetch();
		}, 60);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setFormData({
			username: username ?? "",
			lastname,
			name,
		});
		setValue("name", name);
		setValue("lastname", lastname);
		setValue("username", username ?? "");
	}, []);

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
		<Box>
			<Box
				marginBottom={3}
				display="flex"
				justifyContent="left"
				alignItems="center"
				gap={2}
			>
				<Tooltip title="Regresar">
					<IconButton aria-label="back" onClick={handleBackEdit} size="large">
						<ArrowBack />
					</IconButton>
				</Tooltip>
				<Typography variant="h5">Editar perfil</Typography>
			</Box>
			{isError ? (
				<Alert severity="error" style={{ marginBottom: 5 }}>
					{error.message}
				</Alert>
			) : null}
			<Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
				<Grid2 container spacing={2}>
					<Grid2 size={4}>
						<FormControl fullWidth>
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
					</Grid2>
					<Grid2 size={4}>
						<FormControl fullWidth>
							<FormLabel htmlFor="lastname">Apellidos</FormLabel>
							<TextField
								{...register("lastname", {
									required: "Ingrese sus nombres",
								})}
								error={!!errors.lastname}
								helperText={errors.lastname?.message as ReactNode}
								placeholder="Pérez"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={errors.lastname ? "error" : "primary"}
							/>
						</FormControl>
					</Grid2>
					<Grid2 size={4}>
						<FormControl fullWidth>
							<FormLabel htmlFor="username">Nombre de usuario</FormLabel>
							<TextField
								{...register("username")}
								error={!!errors.username}
								helperText={errors.username?.message as ReactNode}
								placeholder="juan123"
								autoFocus
								fullWidth
								variant="outlined"
								color={errors.username ? "error" : "primary"}
							/>
						</FormControl>
					</Grid2>
					<Grid2 size={12}>
						<Button type="submit" fullWidth variant="contained" formNoValidate>
							Actualizar
						</Button>
					</Grid2>
				</Grid2>
			</Box>
		</Box>
	);
}
