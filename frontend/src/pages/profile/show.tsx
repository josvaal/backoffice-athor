import { Alert, Box, CircularProgress, Grid2 } from "@mui/material";
import toast from "react-hot-toast";
import { useState } from "react";
import { LogoutDialog } from "./components/LogoutDialog";
import { ProfileStaticData } from "./components/ProfileStaticData";
import { ProfileInteractiveData } from "./components/ProfileInteractiveData";
import Cookie from "universal-cookie";
import { useGetIdentity } from "@refinedev/core";

const cookies = new Cookie();

export const ProfileShow = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetIdentity();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    cookies.remove("access_token");
    toast.error("Cerrando sesión...");
  };

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado"}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid2 container spacing={2} columns={24}>
        <Grid2
          size={8}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <ProfileInteractiveData
            data={data}
            handleClickOpen={handleClickOpen}
          />
        </Grid2>
        <Grid2 container size={16}>
          <ProfileStaticData data={data} />
        </Grid2>
      </Grid2>
      <LogoutDialog
        handleClose={handleClose}
        handleLogout={handleLogout}
        open={open}
      />
    </>
  );
};
