import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { getAccessToken } from "../../../utils/retrieve_token";
import Cookies from "universal-cookie";
import axios from "axios";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import { useForm } from "@refinedev/react-hook-form";

const cookies = new Cookies();

interface AssignDeviceProps {
  open: boolean;
  handleClose: () => void;
  deviceId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AssignDevice({
  open,
  handleClose,
  deviceId,
  refetch,
}: AssignDeviceProps) {
  const {
    refineCore: { formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const ba_url = import.meta.env.VITE_BA_URL;
    const [token, isError] = await getAccessToken();

    if (isError) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("Ocurrió un error al intentar obtener los datos");
    }

    const userId = Number(data.userId);

    const response = await axios.post(
      `${ba_url}/devices/assign/user/${userId}/device/${deviceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      console.log(response.data.error);
      toast.error("Error asignando el dispositivo o este usuario no existe");
      throw new Error(response.data.error.message);
    }

    toast.success("Dispositivo asignado con éxito");
    refetch();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
          Asignar dispositivo a usuario
        </Typography>
        <TextField
          {...register("userId", {
            required: "El id de usuario es requerido",
          })}
          error={!!errors.userId}
          helperText={errors.userId?.message as ReactNode}
          placeholder=""
          margin="normal"
          required
          color={errors.userId ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="number"
          label="ID de usuario"
          name="userId"
        />
        <Box
          display="flex"
          justifyContent="right"
          alignItems="center"
          gap={1}
          mt={2}
        >
          <Button children="Cancelar" onClick={handleClose} />
          <Button
            children="Asignar"
            color="success"
            type="submit"
            disabled={formLoading}
          />
        </Box>
      </Box>
    </Modal>
  );
}
