import { Check, Close } from "@mui/icons-material";
import { Alert, Stack, Typography } from "@mui/material";
import { usePermissions, useShow } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  ListButton,
  RefreshButton,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export const EventShow = () => {
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

    console.log(record);

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
      title={<Typography variant="h5">Ver tipo de evento</Typography>}
      headerButtons={
        <>
          <ListButton />
          {permissionPaths.includes(
            location.pathname.replace(/\/events\/show\/\d+/, "/events/delete")
          ) ||
          permissionPaths.includes(
            location.pathname.replace(/\/events\/show\/\d+/, "/events")
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
          {"Nombre (Tipo de evento)"}
        </Typography>
        <TextField value={recordData ? recordData.eventType.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Descripción (Tipo de evento)"}
        </Typography>
        <TextField
          value={recordData ? recordData.eventType.description : "-"}
        />
        <Typography variant="body1" fontWeight="bold">
          {"Estado"}
        </Typography>
        {recordData ? (
          <>
            {recordData.status ? (
              <Check color="success" />
            ) : (
              <Close color="error" />
            )}
          </>
        ) : (
          <Typography> - </Typography>
        )}
      </Stack>
    </Show>
  );
};
