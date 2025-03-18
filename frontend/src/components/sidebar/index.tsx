import { Box, CircularProgress, Divider } from "@mui/material";
import { useGetIdentity, usePermissions } from "@refinedev/core";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "universal-cookie";

const cookies = new Cookie();

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

  return (
    <>
      {items.filter((item: any) => permissionPaths.includes(item.key))}
      <Divider />
      {logout}
    </>
  );
};
