import { create } from "zustand";

interface AuthState {
	isAuthenticated: boolean;
	setAuthenticated: (auth: boolean) => void;
	accessToken: string;
	refreshToken: string;
	setAccessToken: (token: string) => void;
	setRefreshToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	accessToken: "",
	refreshToken: "",
	setAuthenticated: (auth: boolean) => set({ isAuthenticated: auth }),
	setAccessToken: (token: string) => set({ accessToken: token }),
	setRefreshToken: (token: string) => set({ refreshToken: token }),
}));
