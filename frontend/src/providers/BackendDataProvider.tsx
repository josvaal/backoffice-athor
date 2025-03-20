import {
  BaseKey,
  CreateResponse,
  CrudFilter,
  CrudSort,
  DataProvider,
  DeleteOneResponse,
  GetListResponse,
  GetOneResponse,
  MetaQuery,
  UpdateResponse,
  type Pagination,
} from "@refinedev/core";
import axios from "axios";
import { getAccessToken } from "../utils/retrieve_token";
import Cookie from "universal-cookie";

const cookies = new Cookie();

export const customDataProvider: DataProvider = {
  // required methods
  getList: ({ resource, pagination, sorters, filters, meta }) =>
    getListProvider({ resource, pagination, sorters, filters, meta }),
  create: ({ resource, variables, meta }) =>
    createProvider({ resource, variables, meta }),
  update: ({ resource, id, variables, meta }) =>
    updateProvider({ resource, id, variables, meta }),
  deleteOne: ({ resource, id, variables, meta }) =>
    deleteOneProvider({ resource, id, variables, meta }),
  getOne: ({ resource, id, meta }) => getOneProvider({ resource, id, meta }),
  getApiUrl: () => "",
};

//TODO: Si la sesion expira no funca, haz que haga /token/verify y /token/refresh
const getListProvider = async ({
  resource,
  pagination,
  sorters,
  filters,
  meta,
}: {
  resource: string;
  pagination: Pagination | undefined;
  sorters: CrudSort[] | undefined;
  filters: CrudFilter[] | undefined;
  meta: MetaQuery | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<GetListResponse<any>> => {
  const { current, pageSize } = pagination ?? {};

  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  if (isError) {
    cookies.remove("access_token", { path: "/" });
    window.location.reload();
    throw new Error("Ocurrió un error al intentar obtener los datos");
  }

  // Adjust request parameters to meet the requirements of your API
  const response = await axios.get(`${ba_url}/${resource}/list`, {
    params: { _page: current, _limit: pageSize },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  // The total row count could be sourced differently based on the provider
  const total = response.headers["x-total-count"] ?? response.data.length;

  return {
    data: response.data,
    total,
  };
};

const getOneProvider = async ({
  resource,
  id,
  meta,
}: {
  resource: string;
  id: BaseKey;
  meta: MetaQuery | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<GetOneResponse<any>> => {
  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  if (isError) {
    cookies.remove("access_token", { path: "/" });
    window.location.reload();
    throw new Error("Ocurrió un error al intentar obtener los datos");
  }

  // Adjust request parameters to meet the requirements of your API
  const response = await axios.get(`${ba_url}/${resource}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    data: response.data,
  };
};

const createProvider = async ({
  resource,
  variables,
  meta,
}: {
  resource: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: any | undefined;
  meta: MetaQuery | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<CreateResponse<any>> => {
  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  if (isError) {
    cookies.remove("access_token", { path: "/" });
    window.location.reload();
    throw new Error("Ocurrió un error al intentar crear este registro");
  }

  console.log(variables);

  // Adjust request parameters to meet the requirements of your API
  const response = await axios.post(
    `${ba_url}/${resource}/create`,
    JSON.stringify(variables),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  return {
    data: response.data.data,
  };
};

const deleteOneProvider = async ({
  resource,
  id,
  variables,
  meta,
}: {
  resource: string;
  id: BaseKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: any | undefined;
  meta: MetaQuery | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<DeleteOneResponse<any>> => {
  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  if (isError) {
    cookies.remove("access_token", { path: "/" });
    window.location.reload();
    throw new Error("Ocurrió un error al intentar crear este registro");
  }

  // Adjust request parameters to meet the requirements of your API
  const response = await axios.delete(`${ba_url}/${resource}/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  return {
    data: response.data.data,
  };
};

const updateProvider = async ({
  resource,
  id,
  variables,
  meta,
}: {
  resource: string;
  id: BaseKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: any;
  meta: MetaQuery | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<UpdateResponse<any>> => {
  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  if (isError) {
    cookies.remove("access_token", { path: "/" });
    window.location.reload();
    throw new Error("Ocurrió un error al intentar crear este registro");
  }

  // Adjust request parameters to meet the requirements of your API
  const response = await axios.put(
    `${ba_url}/${resource}/update/${id}`,
    JSON.stringify(variables),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  return {
    data: response.data.data,
  };
};
