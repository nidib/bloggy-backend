import { sql } from 'drizzle-orm';

import { InsertUserModel, SelectUserModel, userModel } from 'src/infra/databases/postgres/models/user-model';
import { Postgres } from 'src/infra/databases/postgres/postgres';

export class UserRepository {
	async getOneByUsername(username: string): Promise<null | SelectUserModel> {
		const [user] = await Postgres.connection
			.select()
			.from(userModel)
			.where(sql`${userModel.username} = ${username}`);

		return user ? user : null;
	}

	async createOne(userCandidate: InsertUserModel): Promise<SelectUserModel> {
		const [createdUser] = await Postgres.connection.insert(userModel).values(userCandidate).returning();

		return createdUser;
	}
}
