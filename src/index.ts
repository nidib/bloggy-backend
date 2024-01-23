import { serve } from '@hono/node-server';
import type { Options } from '@hono/node-server/dist/types';

import { makeApp } from 'src/app';
import { envs } from 'src/infra/config/envs';
import { postgres } from 'src/infra/databases/postgres/postgres';

async function setupDatabase() {
	postgres.migrate();
}

async function main() {
	await setupDatabase();

	const app: Options = {
		hostname: '0.0.0.0',
		port: envs.serverPort,
		fetch: makeApp().fetch,
	};

	serve(app, options => {
		console.info(`Server listening at http://${options.address}:${options.port}`);
	});
}

main();
