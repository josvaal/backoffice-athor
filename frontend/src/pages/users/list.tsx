import { Box, Typography } from "@mui/material";
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
import React from "react";
import RoleChip from "../profile/components/RoleChip";

export const UserList = () => {
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
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton
                hideText
                recordItemId={row.id}
                confirmTitle="Estas seguro?"
              />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List
      title={<Typography variant="h5">Usuarios</Typography>}
      headerButtons={<CreateButton>Crear usuario</CreateButton>}
    >
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
