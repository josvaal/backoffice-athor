import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { getAccessToken } from "../../../utils/retrieve_token";
import Cookies from "universal-cookie";
import axios from "axios";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import { useForm } from "@refinedev/react-hook-form";

const cookies = new Cookies();

interface AssignPermissionProps {
  open: boolean;
  handleClose: () => void;
  permissionId: number;
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

export default function AssignPermission({
  open,
  handleClose,
  permissionId,
  refetch,
}: AssignPermissionProps) {
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

    const roleId = Number(data.roleId);

    const response = await axios.post(
      `${ba_url}/permissions/assign/permission/${permissionId}/role/${roleId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) {
      console.log(response.data.error);
      toast.error("Error asignando el permiso o este rol, no existe");
      throw new Error(response.data.error.message);
    }

    toast.success("Permiso asignado con éxito");
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
          Asignar rol a usuario
        </Typography>
        <TextField
          {...register("roleId", {
            required: "El id de rol es requerido",
          })}
          error={!!errors.roleId}
          helperText={errors.roleId?.message as ReactNode}
          placeholder=""
          margin="normal"
          required
          color={errors.roleId ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="number"
          label="ID de rol"
          name="roleId"
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
