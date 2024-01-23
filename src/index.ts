import { serve } from '@hono/node-server';
import type { Options } from '@hono/node-server/dist/types';

import { makeApp } from 'src/app';

function setupDatabase() {
	return Promise.all([]);
}

async function main() {
	// validateEnvs();
	await setupDatabase();

	const app: Options = {
		hostname: '0.0.0.0',
		port: 8080,
		fetch: makeApp().fetch,
	};

	let server = serve(app, options => {
		console.info(`Server listening at http://${options.address}:${options.port}`);
	});
}

main();
