import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { getAccessToken } from "../utils/retrieve_token";
import { useAuthStore } from "../global/IsAuthenticated";
import toast from "react-hot-toast";

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
}) => {
  const { current, pageSize } = pagination ?? {};

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Cerrando sesión...");
    window.location.reload();
  };

  const ba_url = import.meta.env.VITE_BA_URL;
  const token = getAccessToken();
  if (
    !token ||
    token.trim() === "" ||
    token === undefined ||
    token === "undefined"
  ) {
    handleLogout();
    return;
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

const getOneProvider = async ({ resource, id, meta }) => {
  // You can handle the request according to your API requirements.
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Cerrando sesión...");
    window.location.reload();
  };

  const ba_url = import.meta.env.VITE_BA_URL;
  const token = getAccessToken();
  if (
    !token ||
    token.trim() === "" ||
    token === undefined ||
    token === "undefined"
  ) {
    handleLogout();
    return;
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
