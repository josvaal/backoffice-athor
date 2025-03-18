import { Box, CircularProgress, Divider } from "@mui/material";
import { usePermissions } from "@refinedev/core";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "universal-cookie";

const cookies = new Cookie();

interface SidebarProps {
  items: JSX.Element[];
  logout: React.ReactNode;
  collapsed: boolean;
}
interface MyData {
  data: any;
}

export const Sidebar = ({ items, logout }: SidebarProps) => {
  const { data, isLoading } = usePermissions();
  const [rolesId, setRolesId] = useState<number[]>([]);
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);

  useEffect(() => {
    if (data && (data as MyData).data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ids = (data as MyData).data.map((d: any) => d.id);
      setRolesId(ids);
    }
  }, [data]);
  console.log(items);

  const fetchPermissions = async () => {
    const token = cookies.get("access_token");

    if (!token) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("No hay una sesión activa");
    }

    const ba_url = import.meta.env.VITE_BA_URL;
    const response = await axios.post(
      `${ba_url}/permission/role`,
      {
        roleIds: rolesId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const permissions = response.data.data.map((permission: any) => {
    //   return permission.permission;
    // });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const permissionPaths = response.data.data.map((permission: any) => {
      return permission.permission.path;
    });

    console.log(permissionPaths);
    setPermissionPaths(permissionPaths);
  };

  useEffect(() => {
    if (rolesId.length > 0) {
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesId]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {items.filter((item: any) => permissionPaths.includes(item.key))}
      <Divider />
      {logout}
    </>
  );
};
