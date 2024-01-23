import { migrator } from 'src/infra/databases/postgres/migrator';

class Postgres {
	async migrate(): Promise<void> {
		migrator.migrate();
	}
}

export const postgres = new Postgres();
