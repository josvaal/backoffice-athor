import toast from "react-hot-toast";

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
	toast.error("Tu sesión se encuentra expirada o cerrada.");
	return undefined;
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
	toast.error("Tu sesión se encuentra expirada o cerrada");
	return undefined;
}

export async function refreshToken(): Promise<boolean> {
	console.log("Intentando refrescar token...");
	const ba_url = import.meta.env.VITE_BA_URL;
	const token = retrieveRefreshToken();
	if (token === undefined) {
		return false;
	}
	const response = await fetch(`${ba_url}/token/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await response.json();
	if (!data || data.error) {
		toast.error(data.error.message);
		return false;
	}

	localStorage.setItem("access_token", data.data.access_token);
	localStorage.setItem("refresh_token", data.data.refresh_token);
	return true;
}
