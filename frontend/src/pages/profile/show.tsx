import { Alert, Box, CircularProgress, Grid2 } from "@mui/material";
import { useAuthStore } from "../../global/IsAuthenticated";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useState } from "react";
import { LogoutDialog } from "./components/LogoutDialog";
import { ProfileStaticData } from "./components/ProfileStaticData";
import { ProfileInteractiveData } from "./components/ProfileInteractiveData";
import { profileGetData } from "./api/profileFetchData";
import ProfileEdit from "./edit";
import Cookie from "universal-cookie";

const cookies = new Cookie();

export const ProfileShow = () => {
  const { setAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");

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
    setAuthenticated(false);
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleBackEdit = () => {
    setMode("view");
  };

  const { isLoading, isError, error, refetch, data } = useQuery(
    ["profile"],
    () => profileGetData({ handleLogout }),
    {
      onError: async (err: Error) => {
        console.log(err);
        handleLogout();
        toast.error(err.message);
      },
      // Para que no haga refetching
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  if (isError) {
    return <Alert severity="error">{error.message}</Alert>;
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
      {mode === "view" ? (
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
                handleEdit={handleEdit}
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
      ) : (
        <ProfileEdit {...data} handleBackEdit={handleBackEdit} />
      )}
    </>
  );
};
