import toast from "react-hot-toast";
import { getAccessToken } from "../../../utils/retrieve_token";

interface profileGetDataProps {
  handleLogout: () => void;
}

export const profileGetData = async ({ handleLogout }: profileGetDataProps) => {
  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  // console.log(token, isError);

  if (isError) {
    handleLogout();
    return;
  }

  const response = await fetch(`${ba_url}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // console.log(data);
  if (data.error) {
    throw new Error(data.error.message);
  }
  // console.log(data);
  // console.log(data.data);
  return data.data;
};

interface profilePutBody {
  name: string;
  lastname: string;
  username: string;
}

interface profilePutDataProps {
  handleLogout: () => void;
  handleBackEdit: () => void;
  bodyData: profilePutBody;
}

export const profilePutData = async ({
  handleLogout,
  handleBackEdit,
  bodyData,
}: profilePutDataProps) => {
  const ba_url = import.meta.env.VITE_BA_URL;
  const [token, isError] = await getAccessToken();

  if (isError) {
    handleLogout();
    return;
  }

  const response = await fetch(`${ba_url}/auth/me`, {
    method: "PUT",
    body: JSON.stringify(bodyData),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.error) {
    toast.success("Perfil actualizado con éxito");
    handleBackEdit();
    return data.data;
  }

  throw new Error(data.error.message);
};
