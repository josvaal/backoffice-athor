import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { retrieveAccesToken } from "../utils/retrieve_token";
import { useAuthStore } from "../global/IsAuthenticated";
import toast from "react-hot-toast";

export const customDataProvider: DataProvider = {
  // required methods
  getList: ({ resource, pagination, sorters, filters, meta }) =>
    getListProvider({ resource, pagination, sorters, filters, meta }),
  create: ({ resource, variables, meta }) => Promise,
  update: ({ resource, id, variables, meta }) => Promise,
  deleteOne: ({ resource, id, variables, meta }) => Promise,
  getOne: ({ resource, id, meta }) => Promise,
  getApiUrl: () => "",
};
