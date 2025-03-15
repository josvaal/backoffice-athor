import { Chip } from "@mui/material";

interface RoleChipProps {
  role: string;
}

export default function RoleChip({ role }: RoleChipProps) {
  if (role === "usuario") {
    return (
      <Chip
        label={role.toUpperCase()}
        size="small"
        color="primary"
        variant="outlined"
      />
    );
  }

  if (role === "admin") {
    return (
      <Chip
        label={role.toUpperCase()}
        size="small"
        color="warning"
        variant="outlined"
      />
    );
  }

  if (role === "superadmin") {
    return (
      <Chip
        label={role.toUpperCase()}
        size="small"
        color="error"
        variant="outlined"
      />
    );
  }

  return <Chip label={role.toUpperCase()} size="small" />;
}
