import { Alert, Box, TextField, Typography } from "@mui/material";
import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { usePermissions } from "@refinedev/core";

export const DeviceCreate = () => {
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
      title={<Typography variant="h5">Crear dispositivo</Typography>}
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
          {...register("batch", {
            required: "El lote es requerido",
          })}
          error={!!errors.batch}
          helperText={errors.batch?.message as ReactNode}
          placeholder="Lote"
          margin="normal"
          required
          color={errors.batch ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Lote"
          name="batch"
        />
        <TextField
          {...register("macBluetooth", {
            required: "MAC Bluetooth requerida",
          })}
          error={!!errors.macBluetooth}
          helperText={errors.macBluetooth?.message as ReactNode}
          placeholder="B-000"
          margin="normal"
          required
          color={errors.macBluetooth ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="MAC Bluetooth"
          name="macBluetooth"
        />
        <TextField
          {...register("macESP32", {
            required: "MAC Bluetooth requerida",
          })}
          error={!!errors.macESP32}
          helperText={errors.macESP32?.message as ReactNode}
          placeholder="ESP-000"
          margin="normal"
          required
          color={errors.macESP32 ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="MAC ESP32"
          name="macESP32"
        />
        <TextField
          {...register("modelId", {
            required: "ID del Modelo requerido",
          })}
          error={!!errors.modelId}
          helperText={errors.modelId?.message as ReactNode}
          placeholder="-"
          margin="normal"
          required
          color={errors.modelId ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="number"
          label="ID del Modelo"
          name="modelId"
        />
        <TextField
          {...register("relayQuantity", {
            required: "Cantidad de relays requerido",
          })}
          error={!!errors.relayQuantity}
          helperText={errors.relayQuantity?.message as ReactNode}
          placeholder="-"
          margin="normal"
          required
          color={errors.relayQuantity ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="number"
          label="Cantidad de relays"
          name="relayQuantity"
        />
        <TextField
          {...register("serialNumber", {
            required: "Nro. de serie requerido",
          })}
          error={!!errors.serialNumber}
          helperText={errors.serialNumber?.message as ReactNode}
          placeholder="ABC000"
          margin="normal"
          required
          color={errors.serialNumber ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Nº serie"
          name="serialNumber"
        />
        <TextField
          {...register("statusId", {
            required: "ID de estado requerido",
          })}
          error={!!errors.statusId}
          helperText={errors.statusId?.message as ReactNode}
          placeholder="-"
          margin="normal"
          required
          color={errors.statusId ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="number"
          label="ID de estado"
          name="statusId"
        />
        <TextField
          {...register("superAdminId", {
            required: "ID del super admin requerido",
          })}
          error={!!errors.superAdminId}
          helperText={errors.superAdminId?.message as ReactNode}
          placeholder="-"
          margin="normal"
          required
          color={errors.superAdminId ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="number"
          label="ID del super admin"
          name="superAdminId"
        />
        <TextField
          {...register("version", {
            required: "Versión requerida",
          })}
          error={!!errors.version}
          helperText={errors.version?.message as ReactNode}
          placeholder="0.0.0"
          margin="normal"
          required
          color={errors.version ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Versión"
          name="version"
        />
      </Box>
    </Create>
  );
};
