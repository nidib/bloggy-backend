import { drizzle } from 'drizzle-orm/postgres-js';
import { default as pg } from 'postgres';

import { envs } from 'src/infra/config/envs';
import { migrator } from 'src/infra/databases/postgres/migrator';

const client = pg(envs.databaseUrl);
const ormConnection = drizzle(client, { logger: true });

export class Postgres {
	static connection = ormConnection;

	public static async closeConnection() {
		return client.end();
	}

	public static async healthCheck() {
		await client`SELECT 1 as health_check`;
	}

	static async migrate(): Promise<void> {
		migrator.migrate();
	}
}
