import { StyledBadge } from "./StyledBade";
import { Avatar, Box, Button } from "@mui/material";
import { stringAvatar } from "../../../utils/avatar";
import RoleChip from "./RoleChip";
import { Edit, Logout } from "@mui/icons-material";

interface ProfileInteractiveDataProps {
  data: any;
  handleClickOpen: () => void;
}

export function ProfileInteractiveData({
  data,
  handleClickOpen,
}: ProfileInteractiveDataProps) {
  // console.log(data);
  return (
    <>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar
          style={{ width: 60, height: 60 }}
          {...stringAvatar(data.name, data.lastname)}
        />
      </StyledBadge>
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        marginTop={1}
        marginBottom={1}
      >
        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
        {data.roles.map((role: any, i: number) => (
          <RoleChip role={role} key={i} />
        ))}
      </Box>
      <Box marginTop={1} display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="contained"
          color="info"
          startIcon={<Edit />}
          href="/profile/edit"
        >
          Actualizar
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleClickOpen}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </>
  );
}
