import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AthorSlogan, SitemarkIcon } from "./components/custom-icons";
import { useForm } from "react-hook-form";
import { type ReactNode } from "react";
import { Alert, CircularProgress, Grid2 as Grid, Link } from "@mui/material";
import toast from "react-hot-toast";
import { AuthContainer } from "./components/auth-container";
import { StyledCard } from "./components/styled-card";
import { useRegister } from "@refinedev/core";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const { mutate, isLoading, isError, error } = useRegister();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onSubmit = async (formDataProp: any) => {
    mutate(formDataProp, {
      onSuccess: (data) => {
        console.log(data);
        toast.success("Éxito al iniciar sesión");
      },
      onError: (data) => {
        console.log(data);
      },
    });
  };

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
      <CssBaseline enableColorScheme />
      <AuthContainer direction="column" justifyContent="space-between">
        <StyledCard variant="outlined">
          <AthorSlogan />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Registrarme
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl>
                  <FormLabel htmlFor="email">Correo</FormLabel>
                  <TextField
                    {...register("email", {
                      required: "Ingrese su correo",
                      validate: (value) =>
                        value.includes("@") ||
                        'Un correo incluye un "@" como simbolo',
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message as ReactNode}
                    type="email"
                    placeholder="your@email.com"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.email ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                  <TextField
                    {...register("password", {
                      required: "Ingrese su contraseña",
                      minLength: {
                        value: 8,
                        message: "Mínimo 8 carácteres",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message as ReactNode}
                    placeholder="••••••"
                    type="password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.password ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl>
                  <FormLabel htmlFor="verify_password">
                    Verificar contraseña
                  </FormLabel>
                  <TextField
                    {...register("verify_password", {
                      required: "Vuelva a ingresar su contraseña",
                      validate: (val: string) => {
                        if (watch("password") !== val) {
                          return "Las contraseñas no coinciden";
                        }
                      },
                    })}
                    error={!!errors.verify_password}
                    helperText={errors.verify_password?.message as ReactNode}
                    placeholder="••••••"
                    type="password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.verify_password ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl>
                  <FormLabel htmlFor="name">Nombres</FormLabel>
                  <TextField
                    {...register("name", {
                      required: "Ingrese sus nombres",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message as ReactNode}
                    placeholder="Juan"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.name ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl>
                  <FormLabel htmlFor="lastname">Apellidos</FormLabel>
                  <TextField
                    {...register("lastname", {
                      required: "Ingrese sus nombres",
                    })}
                    error={!!errors.lastname}
                    helperText={errors.lastname?.message as ReactNode}
                    placeholder="Perez"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={errors.lastname ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
            </Grid>
            {isError && <Alert severity="error">{error.message}</Alert>}
            <Button
              disabled={isLoading}
              style={{ marginTop: 5 }}
              type="submit"
              fullWidth
              variant="contained"
              formNoValidate
            >
              Registrarme
            </Button>
            <Link href="/login" sx={{ alignSelf: "center" }}>
              ¿Ya tienes una cuenta?
            </Link>
          </Box>
        </StyledCard>
      </AuthContainer>
    </>
  );
}
