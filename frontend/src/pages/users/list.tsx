import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

export const UserList = () => {
  const { dataGridProps } = useDataGrid({});

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
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
