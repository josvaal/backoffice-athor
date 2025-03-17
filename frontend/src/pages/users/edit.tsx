import { Box, TextField, Typography } from "@mui/material";
import { Edit, ListButton, RefreshButton, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { ReactNode, useEffect } from "react";

export const UserEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    setValue,
    formState: { errors },
  } = useForm({});

  const userData = queryResult?.data?.data.data;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disabled, ...restSaveButtonProps } = saveButtonProps;

  useEffect(() => {
    if (!formLoading) {
      setValue("name", userData.name);
      setValue("lastname", userData.lastname);
      setValue("username", userData.username ?? "");
    }
  }, [formLoading, setValue, userData]);
  //TODO:  Invalid `this.prismaService.userRole.create()` invocation in /home/aukdedev/code/backoffice-athor/backend/src/users/users.service.ts:123:60 120 throw new InternalServerErrorException('Error al crear el usuario'); 121 } 122 → 123 const assigned = await this.prismaService.userRole.create( Unique constraint failed on the constraint: `dbo.UserRole`
  return (
    <Edit
      resource="users"
      isLoading={formLoading}
      saveButtonProps={restSaveButtonProps}
      title={<Typography variant="h5">Editar usuario</Typography>}
      footerButtons={
        <SaveButton {...restSaveButtonProps} type="submit">
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
