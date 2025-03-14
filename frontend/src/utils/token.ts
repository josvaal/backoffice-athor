import Cookie from "universal-cookie";
import { validateTokenWithBackend } from "./retrieve_token";

const cookies = new Cookie();

export async function checkAccessToken() {
  const token = cookies.get("access_token");

  if (token) {
    const validate = await validateTokenWithBackend(token);

    if (validate) {
      return true;
    }

    cookies.remove("access_token");
    return false;
  }

  return false;
}
