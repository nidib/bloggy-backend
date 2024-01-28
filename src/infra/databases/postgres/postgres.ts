import { drizzle } from 'drizzle-orm/node-postgres';
import path from 'path';
import { Client, Pool } from 'pg';
import Postgrator from 'postgrator';

import { envs } from 'src/infra/config/envs';

const connectionString = `${envs.databaseUrl}/${envs.databaseName}`;
const pool = new Pool({
	connectionString,
});

const ormConnection = drizzle(pool, { logger: false });

export class Postgres {
	static connection = ormConnection;

	public static async closeConnection() {
		await pool.end();
	}

	public static async healthCheck() {
		const client = await pool.connect();

		await client.query('SELECT 1 as health_check');
	}

	static async migrate(): Promise<void> {
		const client = new Client({ connectionString });

		await client.connect();

		const postgrator = new Postgrator({
			migrationPattern: path.resolve(__dirname, 'migrations/*'),
			driver: 'pg',
			database: envs.databaseName,
			schemaTable: 'main.migration_schema',
			currentSchema: 'main',
			execQuery(query) {
				return client.query(query);
			},
		});

		await postgrator.migrate();
	}
}
