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

interface DeassignDeviceProps {
  userId: number;
  roleId: number;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
}

const cookies = new Cookies();

export default function DeassignDevice({
  userId,
  roleId,
  open,
  handleClose,
  refetch,
}: DeassignDeviceProps) {
  const fetch = async () => {
    const ba_url = import.meta.env.VITE_BA_URL;
    const [token, isError] = await getAccessToken();

    if (isError) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("Ocurrió un error al intentar obtener los datos");
    }

    const response = await axios.delete(
      `${ba_url}/roles/deassign/user/${userId}/role/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      toast.error("Error desasignando el rol");
      handleClose();
      throw new Error(response.data.error.message);
    }

    toast.success("Rol desasignado con éxito");
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
          Estás seguro de querer des-asignar este dispositivo a este usuario?
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
