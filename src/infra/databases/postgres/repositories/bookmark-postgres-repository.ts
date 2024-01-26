import { and, eq } from 'drizzle-orm';

import { BookmarkRepository } from 'src/domains/bookmark/repositories/bookmark-repository';
import {
	InsertBookmarkModel,
	SelectBookmarkModel,
	bookmarkModel,
} from 'src/infra/databases/postgres/models/bookmark-model';
import { Postgres } from 'src/infra/databases/postgres/postgres';

export class BookmarkPostgresRepository implements BookmarkRepository {
	async getOne(articleId: string, userId: string): Promise<null | SelectBookmarkModel> {
		const [user] = await Postgres.connection
			.select()
			.from(bookmarkModel)
			.where(and(eq(bookmarkModel.articleId, articleId), eq(bookmarkModel.userId, userId)));

		return user ? user : null;
	}

	async deleteOne(articleId: string, userId: string): Promise<void> {
		await Postgres.connection
			.delete(bookmarkModel)
			.where(and(eq(bookmarkModel.articleId, articleId), eq(bookmarkModel.userId, userId)));
	}

	async createOne(articleId: string, userId: string): Promise<void> {
		await Postgres.connection.insert(bookmarkModel).values({ userId, articleId });
	}
}
