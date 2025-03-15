import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { getAccessToken } from "../../utils/retrieve_token";
import { Controller } from "react-hook-form";

export const UserCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disabled, ...restSaveButtonProps } = saveButtonProps;

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roles, setRoles] = useState<any[]>([]);

  const fetchRoles = async () => {
    const ba_url = import.meta.env.VITE_BA_URL;

    const [token, isError] = await getAccessToken();

    if (isError) {
      setErrorRoles(true);
      setLoadingRoles(false);
    }

    const response = await fetch(`${ba_url}/roles/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.error) {
      setErrorRoles(true);
      setLoadingRoles(false);
    }

    setLoadingRoles(false);
    setRoles(data.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchRoles();
    };

    fetchData();
  }, []);

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={restSaveButtonProps}
      title={<Typography variant="h5">Crear usuario</Typography>}
      footerButtons={
        <SaveButton
          disabled={errorRoles}
          {...restSaveButtonProps}
          type="submit"
        >
          Registrar
        </SaveButton>
      }
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("email", {
            required: "Correo requerido",
            validate: (value) =>
              value.includes("@") || 'Un correo incluye un "@" como simbolo',
          })}
          error={!!errors.email}
          helperText={errors.email?.message as ReactNode}
          placeholder="tu@correo.com"
          margin="normal"
          required
          color={errors.email ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="email"
          label="Correo"
          name="email"
        />
        <TextField
          {...register("password", {
            required: "Ingrese su contraseña",
            minLength: {
              value: 8,
              message: "Mínimo 8 carácteres",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message as ReactNode}
          placeholder="••••••"
          type="password"
          margin="normal"
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
          label="Contraseña"
          color={errors.password ? "error" : "primary"}
        />
        <TextField
          {...register("name", {
            required: "Nombres requeridos",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as ReactNode}
          placeholder="Juan"
          margin="normal"
          required
          color={errors.name ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Nombres"
          name="name"
        />
        <TextField
          {...register("lastname", {
            required: "Apellidos requeridos",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as ReactNode}
          placeholder="Perez"
          margin="normal"
          required
          color={errors.lastname ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Apellidos"
          name="lastname"
        />
        {loadingRoles ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {errorRoles ? (
              <Alert severity="error">
                Ocurrió un error cargando los roles
              </Alert>
            ) : (
              <Controller
                name="roleId"
                defaultValue={1}
                control={control}
                render={({ field }) => {
                  return (
                    <FormControl style={{ marginTop: 15 }}>
                      <InputLabel id="rol-label">Rol*</InputLabel>
                      <Select
                        labelId="rol-label"
                        {...field}
                        value={field?.value || 1}
                        required
                      >
                        {(roles ? roles : []).map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name.toUpperCase() as string}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
            )}
          </>
        )}
      </Box>
    </Create>
  );
};
