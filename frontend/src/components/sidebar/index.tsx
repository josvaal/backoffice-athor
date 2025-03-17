import { Divider } from "@mui/material";
import { usePermissions } from "@refinedev/core";

interface SidebarProps {
  items: JSX.Element[];
  logout: React.ReactNode;
  collapsed: boolean;
}

export const Sidebar = ({ items, logout }: SidebarProps) => {
  const { data: permissionsData } = usePermissions();

  console.log(permissionsData);

  const pathItems = items.map((item) => {
    return item.key;
  });

  console.log(pathItems);

  return (
    <>
      {/* <div>My Custom Element</div> */}
      {items}
      <Divider />
      {logout}
    </>
  );
};
