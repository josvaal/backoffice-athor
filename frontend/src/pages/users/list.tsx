import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import {
  DataGrid,
  GridRenderCellParams,
  type GridColDef,
} from "@mui/x-data-grid";
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
import RoleChip from "../profile/components/RoleChip";
import { usePermissions } from "@refinedev/core";
import { useLocation } from "react-router";

export const UserList = () => {
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
        field: "email",
        headerName: "Correo",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "name",
        flex: 1,
        headerName: "Nombres",
        minWidth: 160,
        display: "flex",
      },
      {
        field: "lastname",
        headerName: "Apellidos",
        minWidth: 160,
        display: "flex",
      },
      {
        field: "username",
        headerName: "Nombre de usuario",
        minWidth: 80,
        display: "flex",
      },
      {
        field: "UserRole",
        headerName: "Roles",
        display: "flex",
        minWidth: 300,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderCell: (params: GridRenderCellParams<any>) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = params.value as any[];
          return (
            <Box display="flex" gap={1} justifyContent="center">
              {value.map((role, i: number) => (
                <RoleChip role={role.role.name} key={i} />
              ))}
            </Box>
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
              {permissionPaths.includes(`${location.pathname}/edit`) ||
              permissionPaths.includes(location.pathname) ? (
                <EditButton hideText recordItemId={row.id} />
              ) : null}
              {permissionPaths.includes(`${location.pathname}/show`) ||
              permissionPaths.includes(location.pathname) ? (
                <ShowButton hideText recordItemId={row.id} />
              ) : null}
              {permissionPaths.includes(`${location.pathname}/delete`) ||
              permissionPaths.includes(location.pathname) ? (
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
      title={<Typography variant="h5">Usuarios</Typography>}
      headerButtons={
        permissionPaths.includes(`${location.pathname}/create`) ||
        permissionPaths.includes(location.pathname) ? (
          <CreateButton>Crear usuario</CreateButton>
        ) : (
          <Typography> - </Typography>
        )
      }
    >
      {!permissionPaths.includes(`${location.pathname}/list`) &&
      !permissionPaths.includes(location.pathname) ? (
        <Alert severity="error">No tienes los permisos suficientes</Alert>
      ) : (
        <DataGrid {...dataGridProps} columns={columns} />
      )}
    </List>
  );
};
