import {
  Autocomplete,
  Box,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {
  Edit,
  ListButton,
  RefreshButton,
  SaveButton,
  useAutocomplete,
} from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { getAccessToken } from "../../utils/retrieve_token";

export const UserEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({});

  const userData = queryResult?.data?.data.data;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disabled, ...restSaveButtonProps } = saveButtonProps;

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roles, setRoles] = useState<any[]>([]);

  const fetchRoles = async () => {
    const ba_url = import.meta.env.VITE_BA_URL;

    const [token, isError] = await getAccessToken();

    if (isError) {
      setErrorRoles(true);
      setLoadingRoles(false);
    }

    const response = await fetch(`${ba_url}/roles/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.error) {
      setErrorRoles(true);
      setLoadingRoles(false);
    }

    setLoadingRoles(false);
    setRoles(data.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchRoles();
    };

    fetchData();
    if (!formLoading) {
      setValue("name", userData.name);
      setValue("lastname", userData.lastname);
      setValue("username", userData.username ?? "");
    }
  }, [formLoading, setValue, userData]);

  return (
    <Edit
      resource="users"
      isLoading={formLoading}
      saveButtonProps={restSaveButtonProps}
      title={<Typography variant="h5">Editar usuario</Typography>}
      footerButtons={
        <SaveButton
          disabled={errorRoles}
          {...restSaveButtonProps}
          type="submit"
        >
          Actualizar
        </SaveButton>
      }
      headerButtons={
        <>
          <RefreshButton children="Refrescar" /> <ListButton />
        </>
      }
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "Nombres requeridos",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as ReactNode}
          placeholder="Juan"
          margin="normal"
          required
          color={errors.name ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Nombres"
          name="name"
        />
        <TextField
          {...register("lastname", {
            required: "Apellidos requeridos",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as ReactNode}
          placeholder="Perez"
          margin="normal"
          required
          color={errors.lastname ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Apellidos"
          name="lastname"
        />

        <TextField
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message as ReactNode}
          placeholder="juan123"
          margin="normal"
          required
          color={errors.username ? "error" : "primary"}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Nombre de usuario"
          name="username"
        />
      </Box>
    </Edit>
  );
};
