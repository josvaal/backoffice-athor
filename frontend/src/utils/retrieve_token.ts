import toast from "react-hot-toast";
import { useAuthStore } from "../global/IsAuthenticated";

const { setAuthenticated } = useAuthStore();

export function retrieveAccesToken(): string | undefined {
	const token = localStorage.getItem("access_token");
	if (
		token &&
		token.trim() !== "" &&
		token !== undefined &&
		token !== "undefined"
	) {
		return token;
	}
	toast.error("No iniciaste sesión o tu sesión expiró");
	setAuthenticated(false);
}

export function retrieveRefreshToken(): string | undefined {
	const token = localStorage.getItem("refresh_token");
	if (
		token &&
		token.trim() !== "" &&
		token !== undefined &&
		token !== "undefined"
	) {
		return token;
	}
	toast.error("No iniciaste sesión o tu sesión expiró");
	setAuthenticated(false);
}
