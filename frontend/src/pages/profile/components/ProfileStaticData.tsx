import { Grid2, Typography } from "@mui/material";
import type {
	QueryObserverIdleResult,
	QueryObserverLoadingErrorResult,
	QueryObserverLoadingResult,
	QueryObserverRefetchErrorResult,
	QueryObserverSuccessResult,
} from "react-query";

interface ProfileStaticDataProps {
	data: // biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| QueryObserverIdleResult<any, Error>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| QueryObserverLoadingErrorResult<any, Error>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| QueryObserverLoadingResult<any, Error>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| QueryObserverRefetchErrorResult<any, Error>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| QueryObserverSuccessResult<any, Error>["data"];
}

export function ProfileStaticData({ data }: ProfileStaticDataProps) {
	return (
		<>
			<Grid2 size={12}>
				<Typography variant="h6" fontWeight="bold">
					Nombres
				</Typography>
				<Typography>{data.name}</Typography>
			</Grid2>
			<Grid2 size={12}>
				<Typography variant="h6" fontWeight="bold">
					Apellidos
				</Typography>
				<Typography>{data.lastname}</Typography>
			</Grid2>
			<Grid2 size={12}>
				<Typography variant="h6" fontWeight="bold">
					Correo
				</Typography>
				<Typography>{data.email}</Typography>
			</Grid2>
			<Grid2 size={12}>
				<Typography variant="h6" fontWeight="bold">
					Nombre de usuario
				</Typography>
				{data.username ? (
					<Typography>{data.username}</Typography>
				) : (
					<Typography color="textDisabled">No definido</Typography>
				)}
			</Grid2>
		</>
	);
}
