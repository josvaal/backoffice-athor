import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DateField,
  DeleteButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React, { useEffect, useState } from "react";
import { usePermissions } from "@refinedev/core";
import { useLocation } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const DeviceHistoryList = () => {
  const location = useLocation();
  const { data, isLoading } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const { dataGridProps } = useDataGrid({
    filters: {
      mode: "off",
      defaultBehavior: "replace",
    },
  });

  console.log(dataGridProps.rows);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "device_name",
        headerName: "Nombre del modelo",
        minWidth: 160,
        display: "flex",
        valueGetter: (value: number, row) => row.device.model.name,
      },
      {
        field: "device_description",
        headerName: "Descripción del modelo",
        minWidth: 160,
        flex: 1,
        display: "flex",
        valueGetter: (value: number, row) => row.device.model.description,
      },
      {
        field: "event_name",
        headerName: "Nombre del evento",
        minWidth: 160,
        display: "flex",
        valueGetter: (value: number, row) => row.event.eventType.name,
      },
      {
        field: "event_description",
        headerName: "Descripción del evento",
        minWidth: 160,
        display: "flex",
        valueGetter: (value: number, row) => row.event.eventType.description,
      },
      {
        field: "status",
        headerName: "Estado",
        minWidth: 100,
        display: "flex",
        valueGetter: (value: number, row) => (value ? "Encendido" : "Apagado"),
      },
      {
        field: "triggered",
        headerName: "Accionado en",
        minWidth: 160,
        display: "flex",
        renderCell: function render({ value }) {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                value={dayjs.tz(value, "America/Lima")}
                format="MM/DD/YYYY hh:mm:ss"
              />
            </LocalizationProvider>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Creado en",
        minWidth: 100,
        display: "flex",
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
      {
        field: "updatedAt",
        headerName: "Actualizado en",
        minWidth: 100,
        display: "flex",
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              {permissionPaths.includes(`${location.pathname}/show`) ||
              permissionPaths.includes(location.pathname) ||
              permissionPaths.includes("/superadmin") ? (
                <ShowButton hideText recordItemId={row.id} />
              ) : null}
            </>
          );
        },
      },
    ],
    [location.pathname, permissionPaths]
  );

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paths = (data as any).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (permission: any) => permission.path
      );

      console.log(location.pathname);
      console.log(paths);
      setPermissionPaths(paths);
    }
  }, [data, location.pathname]);

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

  return (
    <List
      title={<Typography variant="h5">Historial de dispositivos</Typography>}
      headerButtons={<></>}
    >
      {!permissionPaths.includes(`${location.pathname}/list`) &&
      !permissionPaths.includes(location.pathname) &&
      !permissionPaths.includes("/superadmin") ? (
        <Alert severity="error">No tienes los permisos suficientes</Alert>
      ) : (
        <DataGrid {...dataGridProps} columns={columns} />
      )}
    </List>
  );
};
