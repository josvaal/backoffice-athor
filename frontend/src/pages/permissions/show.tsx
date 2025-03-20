import { AdminPanelSettings, Close } from "@mui/icons-material";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { usePermissions, useShow } from "@refinedev/core";
import {
  DateField,
  ListButton,
  RefreshButton,
  Show,
  TextFieldComponent as TextField,
  useDataGrid,
} from "@refinedev/mui";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import DeassignPermission from "./components/DeassignPermission";
import AssignPermission from "./components/AssignPermission";

export const PermissionShow = () => {
  const location = useLocation();
  const { dataGridProps } = useDataGrid({
    resource: "roles",
    filters: {
      mode: "off",
      defaultBehavior: "replace",
    },
  });
  const { data: permissionsData } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rolesDatagrid, setRolesDatagrid] = useState<any>([]);
  const { query } = useShow({});
  const { data, isLoading, refetch } = query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recordData, setRecordData] = useState<any>({});
  const [openAssign, setOpenAssign] = useState<boolean>(false);
  const [openDeassign, setOpenDeassign] = useState<boolean>(false);
  const [idDeassign, setIdDeassign] = useState<number>(0);

  const handleClickOpenAssign = () => {
    setOpenAssign(true);
  };

  const handleCloseAssign = () => {
    setOpenAssign(false);
  };

  const handleClickOpenDeassign = () => {
    setOpenDeassign(true);
  };

  const handleCloseDeassign = () => {
    setOpenDeassign(false);
  };

  const columns = useMemo<GridColDef[]>(
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
        minWidth: 150,
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
        field: "actions",
        headerName: "Acciones",
        align: "center",
        headerAlign: "center",
        minWidth: 250,
        sortable: false,
        display: "flex",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderCell: function render({ row }) {
          return (
            <>
              {permissionPaths.includes(
                location.pathname.replace(
                  /\/permissions\/show\/\d+/,
                  "/permissions/deassign"
                )
              ) ||
              permissionPaths.includes(
                location.pathname.replace(
                  /\/permissions\/show\/\d+/,
                  "/permissions"
                )
              ) ||
              permissionPaths.includes("/superadmin") ? (
                <Button
                  startIcon={<Close />}
                  color="error"
                  onClick={() => {
                    setIdDeassign(row.id);
                    handleClickOpenDeassign();
                  }}
                >
                  Desasignar Permiso
                </Button>
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
    if (record) {
      console.log(record.RolePermission);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataGridProps.rows = record.RolePermission.map((row: any) => ({
        ...row.role,
      }));
      dataGridProps.loading = false;
      console.log(dataGridProps);
      setRolesDatagrid(dataGridProps);
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
      title={<Typography variant="h5">Ver permiso</Typography>}
      headerButtons={
        <>
          <ListButton />
          <RefreshButton children="Refrescar" />
          {permissionPaths.includes(
            location.pathname.replace(
              /\/permissions\/show\/\d+/,
              "/permissions/assign"
            )
          ) ||
          permissionPaths.includes(
            location.pathname.replace(
              /\/permissions\/show\/\d+/,
              "/permissions"
            )
          ) ||
          permissionPaths.includes("/superadmin") ? (
            <Button
              startIcon={<AdminPanelSettings />}
              onClick={handleClickOpenAssign}
              color="success"
            >
              Asignar permiso
            </Button>
          ) : (
            <Typography> - </Typography>
          )}
        </>
      }
    >
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={recordData ? recordData.id : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombre"}
        </Typography>
        <TextField value={recordData ? recordData.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Descripción"}
        </Typography>
        <TextField value={recordData ? recordData.description : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Ruta"}
        </Typography>
        <TextField value={recordData ? recordData.path : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Grupo"}
        </Typography>
        <TextField value={recordData ? recordData.groupName : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Creado en"}
        </Typography>
        <DateField value={recordData ? recordData.createdAt : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Actualizado en"}
        </Typography>
        <DateField value={recordData ? recordData.updatedAt : "-"} />
      </Stack>
      <Typography
        my={4}
        alignSelf="center"
        variant="h5"
        fontWeight="bold"
        align="center"
      >
        Roles con este permiso
      </Typography>

      <DataGrid {...rolesDatagrid} columns={columns} />

      {recordData ? (
        <DeassignPermission
          open={openDeassign}
          handleClose={handleCloseDeassign}
          roleId={idDeassign}
          permissionId={recordData.id}
          refetch={refetch}
        />
      ) : (
        <></>
      )}

      {recordData ? (
        <AssignPermission
          refetch={refetch}
          open={openAssign}
          handleClose={handleCloseAssign}
          permissionId={recordData.id}
        />
      ) : (
        <></>
      )}
    </Show>
  );
};
