export function checkAccessToken() {
	const token = localStorage.getItem("access_token");
	if (
		token &&
		token.trim() !== "" &&
		token !== undefined &&
		token !== "undefined"
	) {
		return true;
	}
	return false;
}
