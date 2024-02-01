import { serve } from '@hono/node-server';
import type { Options } from '@hono/node-server/dist/types';

import { makeApp } from 'src/app';
import { envs } from 'src/infra/config/envs';
import { Postgres } from 'src/infra/databases/postgres/postgres';

async function setupDatabase() {
	await Postgres.migrate();
}

async function healthCheck() {
	await Postgres.healthCheck();
}

async function main() {
	await setupDatabase();
	await healthCheck();

	const app: Options = {
		hostname: '0.0.0.0',
		port: 8080,
		fetch: makeApp().fetch,
	};

	serve(app, options => {
		console.info(`Server listening at http://${options.address}:${options.port}`);
	});
}

main();
