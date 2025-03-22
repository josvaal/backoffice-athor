import { Alert, Box, TextField, Typography } from "@mui/material";
import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { usePermissions } from "@refinedev/core";

export const UserCreate = () => {
  const location = useLocation();
  const { data } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disabled, ...restSaveButtonProps } = saveButtonProps;

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paths = (data as any).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (permission: any) => permission.path
      );

      console.log(location.pathname.replace(/\/create$/, ""));
      console.log(location.pathname);
      console.log(paths);
      setPermissionPaths(paths);
    }
  }, [data, location.pathname]);

  if (
    !permissionPaths.includes(location.pathname.replace(/\/create$/, "")) &&
    !permissionPaths.includes(location.pathname) &&
    !permissionPaths.includes("/superadmin")
  ) {
    return <Alert severity="error">No tienes los permisos suficientes</Alert>;
  }

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={restSaveButtonProps}
      title={<Typography variant="h5">Crear usuario</Typography>}
      footerButtons={
        <SaveButton
          disabled={formLoading}
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
      </Box>
    </Create>
  );
};
