import toast from "react-hot-toast";
import Cookie from "universal-cookie";

const cookies = new Cookie();

export async function getAccessToken(): Promise<[string | null, boolean]> {
  const token = cookies.get("access_token");

  if (!token) {
    console.log("profileFetchData.ts: ", "No existe el token");
    return [null, true];
  }

  const isValid = await validateTokenWithBackend(token);
  if (!isValid) {
    console.log("profileFetchData.ts: ", "El token no es valido");
    return [null, true];
  }

  return [token, false];
}

export async function validateTokenWithBackend(
  token: string
): Promise<boolean> {
  const backendUrl = import.meta.env.VITE_BA_URL;

  try {
    const response = await fetch(`${backendUrl}/token/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.error) {
      console.log("retrieve_token.ts: ", "data tiene un error");
      console.log(data.error);
      throw new Error(data.error.message);
    }

    return true;
  } catch (error) {
    console.log("retrieve_token.ts: ", { error });
    console.log({ error });
    if (error instanceof Error) {
      toast.error(error.message);
      return false;
    }
    return false;
  }
}
