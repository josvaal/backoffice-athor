export function checkAccessToken() {
	const token = localStorage.getItem("access_token");
	if (token && token.trim() !== "") {
		return true;
	}
	return false;
}
