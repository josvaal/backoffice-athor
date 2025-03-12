import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

interface LogoutDialogProps {
	handleClose: () => void;
	handleLogout: () => void;
	open: boolean;
}

export function LogoutDialog({
	handleClose,
	handleLogout,
	open,
}: LogoutDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				Estas seguro de cerrar sesión
			</DialogTitle>
			<DialogActions>
				<Button onClick={handleClose}>No</Button>
				<Button onClick={handleLogout} autoFocus>
					Si, estoy seguro
				</Button>
			</DialogActions>
		</Dialog>
	);
}
