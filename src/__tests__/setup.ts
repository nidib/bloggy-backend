import { sql } from 'drizzle-orm';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { Postgres } from 'src/infra/databases/postgres/postgres';

async function cleanupDatabase() {
	await Postgres.connection.execute(sql`TRUNCATE TABLE main.bookmark CASCADE`);
	await Postgres.connection.execute(sql`TRUNCATE main.article CASCADE`);
	await Postgres.connection.execute(sql`TRUNCATE main.user CASCADE`);
}

beforeAll(async () => {
	await Postgres.migrate();
	await cleanupDatabase();
});

afterEach(async () => {
	await cleanupDatabase();
});

afterAll(async () => {
	await cleanupDatabase();
	await Postgres.closeConnection();
});
