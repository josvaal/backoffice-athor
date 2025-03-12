import { Chip, Tooltip } from "@mui/material";

interface RoleChipProps {
	role: string;
	description: string;
}

export default function RoleChip({ role, description }: RoleChipProps) {
	if (role === "usuario") {
		return (
			<Tooltip title={description}>
				<Chip
					label={role.toUpperCase()}
					size="small"
					color="primary"
					variant="outlined"
				/>
			</Tooltip>
		);
	}

	if (role === "admin") {
		return (
			<Tooltip title={description}>
				<Chip
					label={role.toUpperCase()}
					size="small"
					color="warning"
					variant="outlined"
				/>
			</Tooltip>
		);
	}

	if (role === "superadmin") {
		return (
			<Tooltip title={description}>
				<Chip
					label={role.toUpperCase()}
					size="small"
					color="error"
					variant="outlined"
				/>
			</Tooltip>
		);
	}

	return <Chip label={role.toUpperCase()} size="small" />;
}
