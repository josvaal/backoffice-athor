import { Alert, Box, TextField, Typography } from "@mui/material";
import { usePermissions } from "@refinedev/core";
import { Edit, ListButton, RefreshButton, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

export const DeviceEdit = () => {
  const location = useLocation();
  const { data } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    setValue,
    formState: { errors },
  } = useForm({});

  const recordData = queryResult?.data?.data.data;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disabled, ...restSaveButtonProps } = saveButtonProps;

  useEffect(() => {
    if (!formLoading) {
      setValue("batch", recordData ? recordData.batch : "");
      setValue("macBluetooth", recordData ? recordData.macBluetooth : "");
      setValue("macESP32", recordData ? recordData.macESP32 : "");
      setValue("relayQuantity", recordData ? recordData.relayQuantity : "");
      setValue("version", recordData ? recordData.version : "");
    }

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paths = (data as any).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (permission: any) => permission.path
      );

      console.log(location.pathname.replace(/\/\d+$/, ""));
      console.log(location.pathname.replace(/\/edit\/\d+$/, ""));
      console.log(location.pathname.replace(/\/edit\/\d+$/, "/show"));
      console.log(paths);
      setPermissionPaths(paths);
    }
  }, [formLoading, setValue, recordData, data, location.pathname]);

  if (
    !permissionPaths.includes(location.pathname.replace(/\/edit\/\d+$/, ""))
  ) {
    if (
      !permissionPaths.includes(location.pathname.replace(/\/\d+$/, "")) &&
      !permissionPaths.includes(
        location.pathname.replace(/\/edit\/\d+$/, "/show")
      ) &&
      !permissionPaths.includes("/superadmin")
    ) {
      return <Alert severity="error">No tienes los permisos suficientes</Alert>;
    }
  }

  return (
    <Edit
      resource="devices"
      isLoading={formLoading}
      saveButtonProps={restSaveButtonProps}
      title={<Typography variant="h5">Editar rol</Typography>}
      footerButtons={
        <SaveButton {...restSaveButtonProps} type="submit">
          Actualizar
        </SaveButton>
      }
      headerButtons={
        <>
          <RefreshButton children="Refrescar" /> <ListButton />
        </>
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
    </Edit>
  );
};
