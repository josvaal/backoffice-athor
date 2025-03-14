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
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useGetIdentity } from "@refinedev/core";
import Cookie from "universal-cookie";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const cookies = new Cookie();
  const [editError, setEditError] = useState<[boolean, string]>([false, ""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    shouldUseNativeValidation: true,
  });
  const { data: user, isLoading, isError, error } = useGetIdentity();

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Cerrando sesión...");
  };

  const onSubmit = async (formDataProp: any) => {
    console.log(formDataProp);

    const ba_url = import.meta.env.VITE_BA_URL;
    const token = cookies.get("access_token");

    if (!token) {
      setEditError([true, "Error al obtener el token"]);
      return;
    }

    const response = await fetch(`${ba_url}/auth/me`, {
      method: "PUT",
      body: JSON.stringify(formDataProp),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      setEditError([true, data.error.message]);
      return;
    }

    toast.success("Perfil actualizado con éxito");
    navigate(-1);
  };

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado"}
      </Alert>
    );
  }

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

  const userData = user as any;
  if (!userData) window.location.reload();
  setValue("name", userData.name);
  setValue("lastname", userData.lastname);
  setValue("username", userData.username ?? "");

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
          <IconButton
            aria-label="back"
            onClick={() => {
              navigate(-1);
            }}
            size="large"
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h5">Editar perfil</Typography>
      </Box>
      {editError[0] && (
        <Alert severity="error">
          {editError[1].length != 0
            ? editError[1]
            : "Ha ocurrido un error inesperado"}
        </Alert>
      )}

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
