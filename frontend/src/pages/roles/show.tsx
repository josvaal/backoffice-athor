import { Close, Person, Visibility } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
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
import { Link, useLocation } from "react-router";
import AssignRole from "./components/AssignRole";
import DeassignRole from "./components/DeassignRole";

type ViewInterface = "users" | "permissions";

export const RoleShow = () => {
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
  const [usersDatagrid, setUsersDataGrid] = useState<any>([]);
  const [permissionsDatagrid, setPermissionsDatagrid] = useState<any>([]);
  const [view, setView] = useState<ViewInterface>("users");
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

  const userColumns = useMemo<GridColDef[]>(
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
        minWidth: 200,
        sortable: false,
        display: "flex",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderCell: function render({ row }) {
          return (
            <>
              {permissionPaths.includes(
                location.pathname.replace(
                  /\/roles\/show\/\d+/,
                  "/roles/deassign"
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
                  Desasignar Rol
                </Button>
              ) : null}
            </>
          );
        },
      },
    ],
    [location.pathname, permissionPaths]
  );

  const permissionColumns = useMemo<GridColDef[]>(
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
        minWidth: 200,
        sortable: false,
        display: "flex",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderCell: function render({ row }) {
          return (
            <>
              {permissionPaths.includes("/permissions/show") ||
              permissionPaths.includes("/permissions") ||
              permissionPaths.includes("/superadmin") ? (
                <Link
                  to={`/permissions/show/${row.id}`}
                  style={{
                    color: "#6e70ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                    fontWeight: "bold",
                  }}
                >
                  <Visibility />
                  Ver permiso
                </Link>
              ) : null}
            </>
          );
        },
      },
    ],
    [permissionPaths]
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
      console.log(record);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUsersDataGrid({
        ...dataGridProps,
        rows: record.UserRole.map((row: any) => ({
          ...row.user,
        })),
      });

      setPermissionsDatagrid({
        ...dataGridProps,
        rows: record.RolePermission.map((row: any) => ({
          ...row.permission,
        })),
      });

      dataGridProps.loading = false;
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
      title={<Typography variant="h5">Ver rol</Typography>}
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
          {"Nombre"}
        </Typography>
        <TextField value={recordData ? recordData.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Descripción"}
        </Typography>
        <TextField value={recordData ? recordData.description : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Creado en"}
        </Typography>
        <DateField value={recordData ? recordData.createdAt : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Actualizado en"}
        </Typography>
        <DateField value={recordData ? recordData.updatedAt : "-"} />
      </Stack>

      <FormControl fullWidth style={{ marginTop: 25 }}>
        <InputLabel id="demo-simple-select-label">Ver</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={view}
          label="Age"
          onChange={(e: SelectChangeEvent) => {
            setView(e.target.value as ViewInterface);
          }}
        >
          <MenuItem value="users">Usuarios</MenuItem>
          <MenuItem value="permissions">Permisos</MenuItem>
        </Select>
      </FormControl>

      {view == "users" ? (
        <>
          <Typography
            my={4}
            alignSelf="center"
            variant="h5"
            fontWeight="bold"
            align="center"
          >
            Usuarios con este dispositivo
          </Typography>
          <DataGrid {...usersDatagrid} columns={userColumns} />
        </>
      ) : (
        <>
          <Typography
            my={4}
            alignSelf="center"
            variant="h5"
            fontWeight="bold"
            align="center"
          >
            Permisos del rol
          </Typography>
          <DataGrid {...permissionsDatagrid} columns={permissionColumns} />
        </>
      )}

      {recordData ? (
        <DeassignRole
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
        <AssignRole
          refetch={refetch}
          open={openAssign}
          handleClose={handleCloseAssign}
          roleId={recordData.id}
        />
      ) : (
        <></>
      )}
    </Show>
  );
};
