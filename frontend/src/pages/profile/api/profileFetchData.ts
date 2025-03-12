import { retrieveAccesToken } from "../../../utils/retrieve_token";

interface profileFetchDataProps {
	handleLogout: () => void;
}

export const profileGetData = async ({
	handleLogout,
}: profileFetchDataProps) => {
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
