import {
  BaseKey,
  CrudFilter,
  CrudSort,
  DataProvider,
  GetListResponse,
  MetaQuery,
  type Pagination,
} from "@refinedev/core";
import axios from "axios";
import { getAccessToken } from "../utils/retrieve_token";
import toast from "react-hot-toast";
import Cookie from "universal-cookie";

const cookies = new Cookie();

export const customDataProvider: DataProvider = {
  // required methods
  getList: ({ resource, pagination, sorters, filters, meta }) =>
    getListProvider({ resource, pagination, sorters, filters, meta }),
  create: ({ resource, variables, meta }) => Promise,
  update: ({ resource, id, variables, meta }) => Promise,
  deleteOne: ({ resource, id, variables, meta }) => Promise,
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
}): Promise<GetListResponse<any>> => {
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
    total: response.data.length,
  };
};
