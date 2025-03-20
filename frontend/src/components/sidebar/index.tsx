import { Box, CircularProgress, Divider } from "@mui/material";
import { usePermissions } from "@refinedev/core";
import { useEffect, useState } from "react";

interface SidebarProps {
  items: JSX.Element[];
  logout: React.ReactNode;
  collapsed: boolean;
}

export const Sidebar = ({ items, logout }: SidebarProps) => {
  const { data, isLoading } = usePermissions();
  const [permissionPaths, setPermissionPaths] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paths = (data as any).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (permission: any) => `/${permission.groupName}`
      );

      setPermissionPaths(paths);
    }
  }, [data]);

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

  if (permissionPaths.includes("/superadmin")) {
    return (
      <>
        {items}
        <Divider />
        {logout}
      </>
    );
  }

  return (
    <>
      {items.filter((item: any) => {
        if (item.key === "/profile") {
          return true;
        }
        return permissionPaths.includes(item.key);
      })}
      <Divider />
      {logout}
    </>
  );
};
