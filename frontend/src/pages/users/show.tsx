import { Alert, Box, Stack, Typography } from "@mui/material";
import { usePermissions, useShow } from "@refinedev/core";
import {
  DateField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import RoleChip from "../profile/components/RoleChip";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export const UserShow = () => {
  const location = useLocation();
  const { data: permissionsData } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);
  const { query } = useShow({});
  const { data, isLoading } = query;
  const [recordData, setRecordData] = useState<any>({});

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
  }, [data, permissionsData]);

  if (
    !permissionPaths.includes(location.pathname.replace(/\/\d+$/, "")) &&
    !permissionPaths.includes(location.pathname.replace(/\/show\/\d+$/, ""))
  ) {
    return <Alert severity="error">No tienes los permisos suficientes</Alert>;
  }

  return (
    <Show
      isLoading={isLoading}
      title={<Typography variant="h5">Ver usuario</Typography>}
    >
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={recordData ? recordData.id : "-"} />

        <Typography variant="body1" fontWeight="bold">
          {"Correo"}
        </Typography>
        <TextField value={recordData ? recordData.email : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombres"}
        </Typography>
        <TextField value={recordData ? recordData.name : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Apellidos"}
        </Typography>
        <TextField value={recordData ? recordData.lastname : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombre de usuario"}
        </Typography>
        <TextField value={recordData ? recordData.username : "-"} />
        <Typography variant="body1" fontWeight="bold">
          {"Roles"}
        </Typography>
        <Box display="flex" gap={1} justifyContent="start">
          {recordData ? (
            <>
              {recordData.UserRole
                ? recordData.UserRole.map((role: any, i: number) => (
                    <RoleChip role={role.role.name} key={i} />
                  ))
                : "-"}
            </>
          ) : (
            "-"
          )}
        </Box>
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
