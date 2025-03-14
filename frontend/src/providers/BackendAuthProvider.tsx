import type { AuthProvider } from "@refinedev/core";
import { getAccessToken } from "../utils/retrieve_token";
import Cookie from "universal-cookie";

const cookies = new Cookie();

export const customAuthProvider: AuthProvider = {
  logout: async () => {
    cookies.remove("access_token");
    return { success: true };
  },

  login: async ({ email, password }) => {
    const ba_url = import.meta.env.VITE_BA_URL;

    const response = await fetch(`${ba_url}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const { error } = data;

    if (error) {
      throw new Error(error.message);
    }

    const dataResponse = data.data;

    const cookieDate = new Date();
    cookieDate.setHours(cookieDate.getHours() + 1);
    cookies.set("access_token", dataResponse.access_token, {
      path: "/",
      expires: cookieDate,
      secure: window.location.protocol === "https:",
      sameSite: "strict",
    });

    return { success: true, redirectTo: "/" };
  },
  check: async () => {
    const [, isError] = await getAccessToken();

    return { authenticated: !isError };
  },
  onError: async (error) => {
    throw new Error("Not implemented");
  },
  // optional methods
  register: async (params) => {
    throw new Error("Not implemented");
  },
  forgotPassword: async (params) => {
    throw new Error("Not implemented");
  },
  updatePassword: async (params) => {
    throw new Error("Not implemented");
  },
  getIdentity: async () => {
    throw new Error("Not implemented");
  },
  getPermissions: async () => {
    throw new Error("Not implemented");
  },
};
