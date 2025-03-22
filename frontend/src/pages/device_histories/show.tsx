import { Check, Close } from "@mui/icons-material";
import { Alert, Stack, Typography } from "@mui/material";
import { usePermissions, useShow } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  ListButton,
  RefreshButton,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

export const DeviceHistoryShow = () => {
  const location = useLocation();
  const { data: permissionsData } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const { query } = useShow({});
  const { data, isLoading } = query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recordData, setRecordData] = useState<any>({});

  useEffect(() => {
    const record = data?.data.data;
    console.log(record);
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
          {"Nombre del modelo"}
        </Typography>
        <TextField value={recordData ? recordData.device.model.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Descripción del modelo"}
        </Typography>
        <TextField
          value={recordData ? recordData.device.model.description : "-"}
        />
        <Typography variant="body1" fontWeight="bold">
          {"Nº Serial del dispositivo"}
        </Typography>
        <TextField value={recordData ? recordData.device.serialNumber : "-"} />
        <Typography variant="body1" fontWeight="bold" color="info">
          {recordData ? (
            <Link to={`/devices/show/${recordData.device.id}`}>
              Ver dispositivo
            </Link>
          ) : null}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {"Nombre del evento"}
        </Typography>
        <TextField value={recordData ? recordData.event.eventType.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Decripción del evento"}
        </Typography>
        <TextField
          value={recordData ? recordData.event.eventType.description : "-"}
        />
        <Typography variant="body1" fontWeight="bold">
          {"Estado del evento"}
        </Typography>
        {recordData ? (
          <>
            {recordData.event.status ? (
              <Check color="success" />
            ) : (
              <Close color="error" />
            )}
          </>
        ) : (
          <Typography> - </Typography>
        )}
        <Typography variant="body1" fontWeight="bold" color="info">
          {recordData ? (
            <Link to={`/events/show/${recordData.event.id}`}>Ver evento</Link>
          ) : null}
        </Typography>
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
