import ky, { type Options } from "ky";
import { supabase } from "./supabase";

//const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const HANZI_SERVICE_URL = import.meta.env.VITE_HANZI_SERVICE_URL;

async function getToken() {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const accessToken = session?.access_token;
	return accessToken;
}

const kyClient = ky.create({
	prefix: HANZI_SERVICE_URL,
	hooks: {
		beforeRequest: [
			async (state) => {
				const token = await getToken();
				if (token) {
					state.request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
	},
});

async function request<T>(
	method: string,
	url: string,
	options?: Options,
): Promise<T> {
	const response = await kyClient(url, {
		method,
		...options,
	});
	const contentType = response.headers.get("content-type");
	if (contentType?.includes("application/json")) {
		return response.json<T>();
	}
	return (await response.text()) as T;
}

export const client = {
	get: <T>(url: string, options?: Options) => request<T>("GET", url, options),
	post: <T>(url: string, json?: unknown, options?: Options) =>
		request<T>("POST", url, {
			...options,
			json,
		}),
	put: <T>(url: string, json?: unknown, options?: Options) =>
		request<T>("PUT", url, {
			...options,
			json,
		}),
	patch: <T>(url: string, json?: unknown, options?: Options) =>
		request<T>("PATCH", url, {
			...options,
			json,
		}),
	delete: <T>(url: string, options?: Options) =>
		request<T>("DELETE", url, options),
};
