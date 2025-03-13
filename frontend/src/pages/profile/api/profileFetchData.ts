import toast from "react-hot-toast";
import { retrieveAccesToken } from "../../../utils/retrieve_token";

interface profileGetDataProps {
	handleLogout: () => void;
}

export const profileGetData = async ({ handleLogout }: profileGetDataProps) => {
	const ba_url = import.meta.env.VITE_BA_URL;
	const token = retrieveAccesToken();
	if (
		!token ||
		token.trim() === "" ||
		token === undefined ||
		token === "undefined"
	) {
		handleLogout();
		return;
	}

	const response = await fetch(`${ba_url}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await response.json();
	if (data.error) {
		throw new Error(data.message);
	}
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
	const token = retrieveAccesToken();
	if (
		!token ||
		token.trim() === "" ||
		token === undefined ||
		token === "undefined"
	) {
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
