import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

dotenv.config();

const databaseName = process.env.TEST_DATABASE_NAME as string;
const databaseUrl = process.env.TEST_DATABASE_URL as string;

export default defineConfig({
	test: {
		env: {
			DATABASE_URL: databaseUrl,
			DATABASE_NAME: databaseName,
		},
		setupFiles: ['./src/__tests__/setup.ts'],
		maxWorkers: 1,
		minWorkers: 1,
		coverage: {
			provider: 'istanbul',
		},
	},
});
