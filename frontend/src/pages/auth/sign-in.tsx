import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SitemarkIcon } from "./components/custom-icons";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Alert, CircularProgress } from "@mui/material";
import Cookies from "universal-cookie";
import { StyledCard } from "./components/styled-card";
import { AuthContainer } from "./components/auth-container";
import { useLogin } from "@refinedev/core";

interface SignInProps {
  handleSetSignUp: () => void;
}

export default function SignIn({ handleSetSignUp }: SignInProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const { mutate, isLoading, isError, error } = useLogin();

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
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Inicio de sesión
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
                helperText={errors.email?.message?.toString()}
                id="email"
                type="email"
                name="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={errors.email ? "error" : "primary"}
              />
            </FormControl>
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
                helperText={errors.password?.message?.toString()}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={errors.password ? "error" : "primary"}
              />
            </FormControl>
            <Button
              disabled={isLoading}
              style={{ marginTop: 5 }}
              type="submit"
              fullWidth
              variant="contained"
              formNoValidate
            >
              Iniciar Sesión
            </Button>
            {isError && <Alert severity="error">{error.message}</Alert>}
            <Button sx={{ alignSelf: "center" }} onClick={handleSetSignUp}>
              ¿No tienes una cuenta?
            </Button>
          </Box>
        </StyledCard>
      </AuthContainer>
    </>
  );
}
