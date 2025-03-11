import type { NotificationProvider } from "@refinedev/core";
import toast from "react-hot-toast";

export const notificationProvider: NotificationProvider = {
	open: ({ key, message, type }) => {
		switch (type) {
			case "success":
				toast.success(message, {
					id: key,
					position: "top-right",
				});
				break;
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
			case "error":
				toast.error(message, {
					id: key,
					position: "top-right",
				});
			default:
				break;
		}
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	close: (key: any) => {
		toast.dismiss(key);
	},
};
