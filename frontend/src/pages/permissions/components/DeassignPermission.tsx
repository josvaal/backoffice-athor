import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { getAccessToken } from "../../../utils/retrieve_token";
import Cookies from "universal-cookie";
import axios from "axios";
import toast from "react-hot-toast";

interface DeassignPermissionProps {
  permissionId: number;
  roleId: number;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
}

const cookies = new Cookies();

export default function DeassignPermission({
  permissionId,
  roleId,
  open,
  handleClose,
  refetch,
}: DeassignPermissionProps) {
  const fetch = async () => {
    const ba_url = import.meta.env.VITE_BA_URL;
    const [token, isError] = await getAccessToken();

    if (isError) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("Ocurrió un error al intentar obtener los datos");
    }

    const response = await axios.delete(
      `${ba_url}/permissions/deassign/permission/${permissionId}/role/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      toast.error("Error desasignando el permiso");
      handleClose();
      throw new Error(response.data.error.message);
    }

    toast.success("Permiso desasignado con éxito");
    refetch();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Estás seguro de querer des-asignar este permiso a este rol?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No, cerrar</Button>
        <Button
          onClick={async () => {
            await fetch();
          }}
          autoFocus
          color="error"
        >
          Si, estoy seguro
        </Button>
      </DialogActions>
    </Dialog>
  );
}
