import adapter from '@sveltejs/adapter-vercel": "next"';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
	}
};

export default config;
