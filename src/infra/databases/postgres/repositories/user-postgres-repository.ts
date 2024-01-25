import { sql } from 'drizzle-orm';

import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { InsertUserModel, SelectUserModel, userModel } from 'src/infra/databases/postgres/models/user-model';
import { Postgres } from 'src/infra/databases/postgres/postgres';

export class UserPostgresRepository implements UserRepository {
	async getOneByUsername(username: string): Promise<null | SelectUserModel> {
		const [user] = await Postgres.connection
			.select()
			.from(userModel)
			.where(sql`${userModel.username} = ${username}`);

		return user ?? null;
	}

	async createOne(userCandidate: InsertUserModel): Promise<SelectUserModel> {
		const [createdUser] = await Postgres.connection.insert(userModel).values(userCandidate).returning();

		return createdUser;
	}

	async getOneById(id: string): Promise<null | SelectUserModel> {
		const [createdUser] = await Postgres.connection
			.select()
			.from(userModel)
			.where(sql`${userModel.id} = ${id}`);

		return createdUser ?? null;
	}
}
