import ky from "ky";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const HANZI_SERVICE_URL = import.meta.env.VITE_HANZI_WEB_WORKER_URL;

function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}

const client = ky.create({
	prefix: HANZI_SERVICE_URL,
	headers: {
		Authorization: `Bearer ${getToken()}`,
	},
	hooks: {
		beforeRequest: [
			({ request }) => {
				const token = getToken();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
	},
});

export { client };
