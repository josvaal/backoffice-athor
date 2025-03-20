import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React, { useEffect, useState } from "react";
import { usePermissions } from "@refinedev/core";
import { useLocation } from "react-router";

export const DeviceStatusList = () => {
  const location = useLocation();
  const { data, isLoading } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const { dataGridProps } = useDataGrid({
    filters: {
      mode: "off",
      defaultBehavior: "replace",
    },
  });

  console.log(dataGridProps);

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
        field: "name",
        headerName: "Nombres",
        minWidth: 160,
        display: "flex",
      },
      {
        field: "description",
        flex: 1,
        headerName: "Descripción",
        minWidth: 160,
        display: "flex",
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
              {permissionPaths.includes(`${location.pathname}/edit`) ||
              permissionPaths.includes(location.pathname) ||
              permissionPaths.includes("/superadmin") ? (
                <EditButton hideText recordItemId={row.id} />
              ) : null}
              {permissionPaths.includes(`${location.pathname}/show`) ||
              permissionPaths.includes(location.pathname) ||
              permissionPaths.includes("/superadmin") ? (
                <ShowButton hideText recordItemId={row.id} />
              ) : null}
              {permissionPaths.includes(`${location.pathname}/delete`) ||
              permissionPaths.includes(location.pathname) ||
              permissionPaths.includes("/superadmin") ? (
                <DeleteButton
                  hideText
                  recordItemId={row.id}
                  confirmTitle="Estas seguro?"
                />
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
      title={<Typography variant="h5">Estado de dispositivos</Typography>}
      headerButtons={
        permissionPaths.includes(`${location.pathname}/create`) ||
        permissionPaths.includes(location.pathname) ||
        permissionPaths.includes("/superadmin") ? (
          <CreateButton>Crear estado de dispositivo</CreateButton>
        ) : (
          <Typography> - </Typography>
        )
      }
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
