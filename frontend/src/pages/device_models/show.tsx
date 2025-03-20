import { Alert, Box, Stack, Typography } from "@mui/material";
import { usePermissions, useShow } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  ListButton,
  RefreshButton,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import RoleChip from "../profile/components/RoleChip";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export const DeviceModelShow = () => {
  const location = useLocation();
  const { data: permissionsData } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const { query } = useShow({});
  const { data, isLoading } = query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recordData, setRecordData] = useState<any>({});

  useEffect(() => {
    const record = data?.data.data;
    setRecordData(record);

    if (permissionsData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paths = (permissionsData as any).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (permission: any) => permission.path
      );

      console.log(location.pathname.replace(/\/\d+$/, ""));
      console.log(location.pathname.replace(/\/show\/\d+$/, ""));
      console.log(paths);
      setPermissionPaths(paths);
    }
  }, [data, location.pathname, permissionsData]);

  if (
    !permissionPaths.includes(location.pathname.replace(/\/\d+$/, "")) &&
    !permissionPaths.includes(location.pathname.replace(/\/show\/\d+$/, "")) &&
    !permissionPaths.includes("/superadmin")
  ) {
    return <Alert severity="error">No tienes los permisos suficientes</Alert>;
  }

  return (
    <Show
      isLoading={isLoading}
      title={<Typography variant="h5">Ver modelo de dispositivo</Typography>}
      headerButtons={
        <>
          <ListButton />
          {permissionPaths.includes(
            location.pathname.replace(
              /\/device_models\/show\/\d+/,
              "/device_models/edit"
            )
          ) ||
          permissionPaths.includes(
            location.pathname.replace(
              /\/device_models\/show\/\d+/,
              "/device_models"
            )
          ) ||
          permissionPaths.includes("/superadmin") ? (
            <EditButton children="Editar" />
          ) : (
            <Typography> - </Typography>
          )}
          {permissionPaths.includes(
            location.pathname.replace(
              /\/device_models\/show\/\d+/,
              "/device_models/delete"
            )
          ) ||
          permissionPaths.includes(
            location.pathname.replace(
              /\/device_models\/show\/\d+/,
              "/device_models"
            )
          ) ||
          permissionPaths.includes("/superadmin") ? (
            <DeleteButton children="Eliminar" />
          ) : (
            <Typography> - </Typography>
          )}
          <RefreshButton children="Refrescar" />
        </>
      }
    >
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={recordData ? recordData.id : "-"} />

        <Typography variant="body1" fontWeight="bold">
          {"Nombres"}
        </Typography>
        <TextField value={recordData ? recordData.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Descripción"}
        </Typography>
        <TextField value={recordData ? recordData.description : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Creado en"}
        </Typography>
        <DateField value={recordData ? recordData.createdAt : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Actualizado en"}
        </Typography>
        <DateField value={recordData ? recordData.updatedAt : "-"} />
      </Stack>
    </Show>
  );
};
