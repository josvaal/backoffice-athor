import { Alert, Box, TextField, Typography } from "@mui/material";
import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { usePermissions } from "@refinedev/core";

export const DeviceStatusCreate = () => {
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
      title={<Typography variant="h5">Crear modelo de dispositivo</Typography>}
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
          {...register("name", {
            required: "Nombre requerido",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as ReactNode}
          placeholder="Dispositivo"
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
          label="Nombre"
          name="name"
        />
        <TextField
          {...register("description", {
            required: "Descripción requerida",
          })}
          error={!!errors.description}
          helperText={errors.description?.message as ReactNode}
          placeholder="Dispositivo-01"
          margin="normal"
          required
          color={errors.description ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Descripción"
          name="description"
        />
      </Box>
    </Create>
  );
};
