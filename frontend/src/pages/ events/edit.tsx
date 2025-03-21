import { Alert, Box, TextField, Typography } from "@mui/material";
import { usePermissions } from "@refinedev/core";
import { Edit, ListButton, RefreshButton, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

export const EventEdit = () => {
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
      setValue("name", recordData ? recordData.name : "");
      setValue("description", recordData ? recordData.description : "");
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
      resource="device_models"
      isLoading={formLoading}
      saveButtonProps={restSaveButtonProps}
      title={<Typography variant="h5">Editar tipo de evento</Typography>}
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
          {...register("name", {
            required: "Nombres requeridos",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as ReactNode}
          placeholder="Evento x"
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
          {...register("description", {
            required: "Descripción requerida",
          })}
          error={!!errors.description}
          helperText={errors.description?.message as ReactNode}
          placeholder="Evento x accionado/desaccionado"
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
    </Edit>
  );
};
