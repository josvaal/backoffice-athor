import type {
	QueryObserverIdleResult,
	QueryObserverLoadingErrorResult,
	QueryObserverLoadingResult,
	QueryObserverRefetchErrorResult,
	QueryObserverSuccessResult,
} from "react-query";
import { StyledBadge } from "./StyledBade";
import { Avatar, Box, Button } from "@mui/material";
import { stringAvatar } from "../../../utils/avatar";
import RoleChip from "./RoleChip";
import { Edit, Logout } from "@mui/icons-material";

interface ProfileInteractiveDataProps {
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
	handleClickOpen: () => void;
	handleEdit: () => void;
}

export function ProfileInteractiveData({
	data,
	handleClickOpen,
	handleEdit,
}: ProfileInteractiveDataProps) {
	return (
		<>
			<StyledBadge
				overlap="circular"
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				variant="dot"
			>
				<Avatar
					style={{ width: 60, height: 60 }}
					{...stringAvatar(data.name, data.lastname)}
				/>
			</StyledBadge>
			<Box
				display="flex"
				flexDirection="column"
				gap={1}
				marginTop={1}
				marginBottom={1}
			>
				{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
				{data.UserRole.map((role: any, i: number) => (
					<RoleChip
						role={role.role.name}
						description={role.role.description}
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
					/>
				))}
			</Box>
			<Box marginTop={1} display="flex" justifyContent="space-between" gap={2}>
				<Button
					variant="contained"
					color="info"
					startIcon={<Edit />}
					onClick={handleEdit}
				>
					Actualizar
				</Button>
				<Button
					variant="contained"
					color="error"
					startIcon={<Logout />}
					onClick={handleClickOpen}
				>
					Cerrar Sesión
				</Button>
			</Box>
		</>
	);
}
