import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		env: {
			DATABASE_URL: 'fakeurl',
			JWT_KEY: 'faketoken',
		},
		coverage: {
			provider: 'istanbul',
		},
	},
});
