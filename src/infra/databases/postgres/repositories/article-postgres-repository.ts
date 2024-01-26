import { bookmarkModel } from '../models/bookmark-model';
import { AnyColumn, SQL, SQLWrapper, and, asc, desc, eq, sql } from 'drizzle-orm';

import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import {
	InsertArticleModel,
	SelectArticleModel,
	SelectArticleWithUser,
	articleModel,
} from 'src/infra/databases/postgres/models/article-model';
import { SelectUserModel, userModel } from 'src/infra/databases/postgres/models/user-model';
import { Postgres } from 'src/infra/databases/postgres/postgres';

export class ArticlePostgresRepository implements ArticleRepository {
	async createOne(candidate: InsertArticleModel): Promise<SelectArticleModel> {
		const [createArticle] = await Postgres.connection.insert(articleModel).values(candidate).returning();

		return createArticle;
	}

	async getOneById(id: string): Promise<null | SelectArticleModel> {
		const [article] = await Postgres.connection
			.select()
			.from(articleModel)
			.where(sql`${articleModel.id} = ${id}`);

		return article ? article : null;
	}

	async getOneByIdAndUser(id: string, userId: string): Promise<null | SelectArticleModel> {
		const [article] = await Postgres.connection
			.select()
			.from(articleModel)
			.where(sql`${articleModel.id} = ${id} AND ${articleModel.userId} = ${userId}`);

		return article ? article : null;
	}

	async getOneByIdWithUser(id: string, userId: string): Promise<null | SelectArticleWithUser> {
		const [result] = await Postgres.connection
			.select()
			.from(articleModel)
			.where(sql`${articleModel.id} = ${id}`)
			.fullJoin(userModel, eq(userModel.id, articleModel.userId));

		if (!result || !result.article || !result.user) {
			return null;
		}

		const [bookmark] = await Postgres.connection
			.select()
			.from(bookmarkModel)
			.where(sql`${bookmarkModel.articleId} = ${id} AND ${bookmarkModel.userId} = ${userId}`);

		return {
			...result.article,
			user: {
				...result.user,
				didBookmark: Boolean(bookmark),
			},
		};
	}

	async updateOne(id: string, userId: string, article: InsertArticleModel): Promise<SelectArticleModel> {
		const [updatedArticle] = await Postgres.connection
			.update(articleModel)
			.set({
				...article,
				updatedAt: new Date(),
			})
			.where(sql`${articleModel.id} = ${id} AND ${articleModel.userId} = ${userId}`)
			.returning();

		return updatedArticle;
	}

	async deleteOne(id: string, userId: string): Promise<null | string> {
		const [article] = await Postgres.connection
			.delete(articleModel)
			.where(sql`${articleModel.id} = ${id} AND ${articleModel.userId} = ${userId}`)
			.returning();

		return article ? article.id : null;
	}

	async getMany(
		userId: string,
		filters: { order: 'asc' | 'desc'; userId?: string }
	): Promise<SelectArticleWithUser[]> {
		const orderByFnByOrder: Record<'asc' | 'desc', (a: SQLWrapper | AnyColumn) => SQL> = {
			asc: asc,
			desc: desc,
		};

		const queryFilters: SQL[] = [];

		if (filters.userId) {
			queryFilters.push(sql`${userModel.id} = ${filters.userId}`);
		}

		const rows = await Postgres.connection
			.select()
			.from(articleModel)
			.fullJoin(userModel, eq(userModel.id, articleModel.userId))
			.where(and(...queryFilters))
			.orderBy(orderByFnByOrder[filters.order](articleModel.createdAt));

		let articles: SelectArticleWithUser[] = [];

		for (const row of rows) {
			const { article, user } = row as { article: null | SelectArticleModel; user: SelectUserModel };

			if (!article) {
				continue;
			}

			const [bookmark] = await Postgres.connection
				.select()
				.from(bookmarkModel)
				.where(sql`${bookmarkModel.articleId} = ${article.id} AND ${bookmarkModel.userId} = ${userId}`);

			articles.push({
				...article,
				user: {
					...user,
					didBookmark: Boolean(bookmark),
				},
			});
		}

		return articles;
	}
}
