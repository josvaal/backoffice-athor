import { Stack, Typography } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
  DateField,
  MarkdownField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";

export const UserShow = () => {
  const { query } = useShow({});

  const { data, isLoading } = query;

  const record = data?.data;
  // console.log(record);

  const { data: userData, isLoading: userIsLoading } = useOne({
    resource: "users",
    id: record?.data.id || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={record?.data.id} />

        <Typography variant="body1" fontWeight="bold">
          {"Correo"}
        </Typography>
        <TextField value={record?.data.email} />

        <Typography variant="body1" fontWeight="bold">
          {"Nombres"}
        </Typography>
        <TextField value={record?.data.name} />

        <Typography variant="body1" fontWeight="bold">
          {"Apellidos"}
        </Typography>
        <TextField value={record?.data.lastname} />
        <Typography variant="body1" fontWeight="bold">
          {"Nombre de usuario"}
        </Typography>
        <TextField value={record?.data.username} />
        <Typography variant="body1" fontWeight="bold">
          {"Creado en"}
        </Typography>
        <DateField value={record?.data.createdAt} />
        <Typography variant="body1" fontWeight="bold">
          {"Actualizado en"}
        </Typography>
        <DateField value={record?.data.updatedAt} />
      </Stack>
    </Show>
  );
};
