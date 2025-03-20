import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DateField, List, ShowButton, useDataGrid } from "@refinedev/mui";
import React, { useEffect, useState } from "react";
import { usePermissions } from "@refinedev/core";
import { useLocation } from "react-router";

export const PermissionList = () => {
  const location = useLocation();
  const { data, isLoading } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const { dataGridProps } = useDataGrid({
    filters: {
      mode: "off",
      defaultBehavior: "replace",
    },
  });

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
        headerName: "Nombre",
        minWidth: 160,
        display: "flex",
      },
      {
        field: "description",
        headerName: "Descripción",
        flex: 1,
        minWidth: 160,
        display: "flex",
      },
      {
        field: "groupName",
        headerName: "Grupo",
        minWidth: 140,
        display: "flex",
      },
      {
        field: "path",
        headerName: "Ruta",
        minWidth: 150,
        display: "flex",
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
        minWidth: 20,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              {permissionPaths.includes(`${location.pathname}/show`) ||
              permissionPaths.includes(location.pathname) ||
              permissionPaths.includes("/superadmin") ? (
                <ShowButton hideText recordItemId={row.id} />
              ) : (
                <Typography> - </Typography>
              )}
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
      title={<Typography variant="h5">Permisos</Typography>}
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
