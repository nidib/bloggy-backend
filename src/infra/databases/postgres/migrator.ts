import path from 'path';
import Postgrator from 'postgrator';
import postgres from 'postgres';

import { envs } from 'src/infra/config/envs';

const MIGRATION_MAX_CONNECTIONS = 1;
const MIGRATION_IDLE_TIMEOUT_IN_SECONDS = 60;

const migrationConnection = postgres(envs.databaseUrl, {
	max: MIGRATION_MAX_CONNECTIONS,
	idle_timeout: MIGRATION_IDLE_TIMEOUT_IN_SECONDS,
});

export const migrator = new Postgrator({
	migrationPattern: path.resolve(__dirname, 'migrations/*'),
	driver: 'pg',
	database: 'bloggy',
	schemaTable: 'main.migration_schema',
	currentSchema: 'main',
	async execQuery(query) {
		const rows = await migrationConnection.unsafe(query);

		return { rows };
	},
});
