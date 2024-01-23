import { serve } from '@hono/node-server';
import type { Options } from '@hono/node-server/dist/types';

import { makeApp } from 'src/app';
import { postgres } from 'src/infra/databases/postgres/postgres';

async function setupDatabase() {
	postgres.migrate();
}

async function main() {
	await setupDatabase();

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
