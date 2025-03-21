import { Close, Person } from "@mui/icons-material";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { usePermissions, useShow } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  ListButton,
  RefreshButton,
  Show,
  TextFieldComponent as TextField,
  useDataGrid,
} from "@refinedev/mui";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import AssignDevice from "./components/AssignDevice";
import DeassignDevice from "./components/DeassignDevice";

export const DeviceShow = () => {
  const location = useLocation();
  const { dataGridProps } = useDataGrid({
    resource: "devices",
    filters: {
      mode: "off",
      defaultBehavior: "replace",
    },
  });
  const { data: permissionsData } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [usersDatagrid, setUsersDataGrid] = useState<any>([]);
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
        flex: 1,
        minWidth: 150,
        display: "flex",
      },
      {
        field: "lastname",
        headerName: "Apellidos",
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
                  /\/devices\/show\/\d+/,
                  "/devices/deassign"
                )
              ) ||
              permissionPaths.includes(
                location.pathname.replace(/\/roles\/show\/\d+/, "/roles")
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
                  Desasignar Dispositivo
                </Button>
              ) : null}
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
      console.log(record.users);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataGridProps.rows = record.users.map((row: any) => ({ ...row.user }));
      dataGridProps.loading = false;
      setUsersDataGrid(dataGridProps);
      console.log(record);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title={<Typography variant="h5">Ver dispositivo</Typography>}
      headerButtons={
        <>
          <ListButton />
          {permissionPaths.includes(
            location.pathname.replace(/\/roles\/show\/\d+/, "/roles/update")
          ) ||
          permissionPaths.includes(
            location.pathname.replace(/\/roles\/show\/\d+/, "/roles")
          ) ||
          permissionPaths.includes("/superadmin") ? (
            <EditButton children="Editar" />
          ) : (
            <Typography> - </Typography>
          )}
          {permissionPaths.includes(
            location.pathname.replace(/\/roles\/show\/\d+/, "/roles/delete")
          ) ||
          permissionPaths.includes(
            location.pathname.replace(/\/roles\/show\/\d+/, "/roles")
          ) ||
          permissionPaths.includes("/superadmin") ? (
            <DeleteButton children="Eliminar" />
          ) : (
            <Typography> - </Typography>
          )}
          <RefreshButton children="Refrescar" />
          {permissionPaths.includes(
            location.pathname.replace(/\/roles\/show\/\d+/, "/roles/assign")
          ) ||
          permissionPaths.includes(
            location.pathname.replace(/\/roles\/show\/\d+/, "/roles")
          ) ||
          permissionPaths.includes("/superadmin") ? (
            <Button
              startIcon={<Person />}
              onClick={handleClickOpenAssign}
              color="success"
            >
              Asignar usuario
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
          {"Estado"}
        </Typography>
        <TextField value={recordData ? recordData.status.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Estado (Descripción)"}
        </Typography>
        <TextField value={recordData ? recordData.status.description : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombres y Apellidos del Super Admin"}
        </Typography>
        <TextField
          value={
            recordData
              ? `${recordData.superAdmin.name} ${recordData.superAdmin.lastname}`
              : "-"
          }
        />
        <Typography variant="body1" fontWeight="bold">
          {"Modelo (Nombre)"}
        </Typography>
        <TextField value={recordData ? recordData.model.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Nº Serie"}
        </Typography>
        <TextField value={recordData ? recordData.serialNumber : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Modelo (Descripción)"}
        </Typography>
        <TextField value={recordData ? recordData.model.description : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"MAC ESP32"}
        </Typography>
        <TextField value={recordData ? recordData.macESP32 : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"MAC Bluetooth"}
        </Typography>
        <TextField value={recordData ? recordData.macBluetooth : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Lote"}
        </Typography>
        <TextField value={recordData ? recordData.batch : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Nº de relays"}
        </Typography>
        <TextField value={recordData ? recordData.relayQuantity : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Versión"}
        </Typography>
        <TextField value={recordData ? recordData.version : "-"} />
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
        Usuarios con este dispositivo
      </Typography>

      <DataGrid {...usersDatagrid} columns={columns} />

      {recordData ? (
        <DeassignDevice
          open={openDeassign}
          handleClose={handleCloseDeassign}
          userId={idDeassign}
          roleId={recordData.id}
          refetch={refetch}
        />
      ) : (
        <></>
      )}

      {recordData ? (
        <AssignDevice
          refetch={refetch}
          open={openAssign}
          handleClose={handleCloseAssign}
          deviceId={recordData.id}
        />
      ) : (
        <></>
      )}
    </Show>
  );
};
