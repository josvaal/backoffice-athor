import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import {
  DateField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";

export const UserShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {"Correo"}
        </Typography>
        <TextField value={record?.email} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombres"}
        </Typography>
        <TextField value={record?.name} />
        <Typography variant="body1" fontWeight="bold">
          {"Apellidos"}
        </Typography>
        <TextField value={record?.lastname} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombre de usuario"}
        </Typography>
        <TextField value={record?.username} />
        <Typography variant="body1" fontWeight="bold">
          {"Creado en"}
        </Typography>
        <DateField value={record?.createdAt} />
        <Typography variant="body1" fontWeight="bold">
          {"Actualizado en"}
        </Typography>
        <DateField value={record?.updatedAt} />
      </Stack>
    </Show>
  );
};
