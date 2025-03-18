import { type AuthProvider } from "@refinedev/core";
import { getAccessToken } from "../utils/retrieve_token";
import Cookie from "universal-cookie";

const cookies = new Cookie();

export const customAuthProvider: AuthProvider = {
  logout: async () => {
    cookies.remove("access_token", { path: "/" });
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
    // console.log(data);
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
      sameSite: "lax",
    });

    return { success: true, redirectTo: "/" };
  },

  check: async () => {
    const [token, isError] = await getAccessToken();

    return { authenticated: !isError, logout: Boolean(!token) };
  },

  onError: async (error) => {
    throw new Error("Not implemented");
  },

  // optional methods
  register: async ({ name, lastname, email, password }) => {
    const ba_url = import.meta.env.VITE_BA_URL;

    const response = await fetch(`${ba_url}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, password, name, lastname }),
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
      sameSite: "lax",
    });

    return { success: true, redirectTo: "/" };
  },

  forgotPassword: async (params) => {
    throw new Error("Not implemented");
  },

  updatePassword: async (params) => {
    throw new Error("Not implemented");
  },

  getIdentity: async () => {
    const token = cookies.get("access_token");

    if (!token) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("No hay una sesión activa");
    }

    const ba_url = import.meta.env.VITE_BA_URL;
    const response = await fetch(`${ba_url}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const { error } = data;

    if (error) {
      throw new Error(error.message);
    }

    const roles: string[] = data.data.UserRole.map(
      (userRole: { role: { name: any } }) => userRole.role.name
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { devices, UserRole, ...restData } = data.data;

    return { roles, ...restData };
  },

  getPermissions: async (params) => {
    const token = cookies.get("access_token");

    if (!token) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("No hay una sesión activa");
    }

    const ba_url = import.meta.env.VITE_BA_URL;
    const response = await fetch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `${ba_url}/permission/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    // console.log(data);

    const { error } = data;

    if (error) {
      throw new Error(error.message);
    }

    // console.log(data.data);
    return data.data;
  },
};
