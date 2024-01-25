import path from 'path';
import Postgrator from 'postgrator';
import pg from 'postgres';

import { envs } from 'src/infra/config/envs';

const noop = () => {};

const MIGRATION_MAX_CONNECTIONS = 1;
const MIGRATION_IDLE_TIMEOUT_IN_SECONDS = 60;

const databaseUrl = `${envs.databaseUrl}/${envs.databaseName}`;
const migrationConnection = pg(databaseUrl, {
	max: MIGRATION_MAX_CONNECTIONS,
	idle_timeout: MIGRATION_IDLE_TIMEOUT_IN_SECONDS,
	onnotice: noop,
});

export const migrator = new Postgrator({
	migrationPattern: path.resolve(__dirname, 'migrations/*'),
	driver: 'pg',
	database: envs.databaseName,
	schemaTable: 'main.migration_schema',
	currentSchema: 'main',
	async execQuery(query) {
		const rows = await migrationConnection.unsafe(query);

		return { rows };
	},
});
