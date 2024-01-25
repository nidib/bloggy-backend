import { eq, sql } from 'drizzle-orm';

import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import {
	InsertArticleModel,
	SelectArticleModel,
	SelectArticleWithUser,
	articleModel,
} from 'src/infra/databases/postgres/models/article-model';
import { userModel } from 'src/infra/databases/postgres/models/user-model';
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

	async getOneByIdWithUser(id: string): Promise<null | SelectArticleWithUser> {
		const [result] = await Postgres.connection
			.select()
			.from(articleModel)
			.where(sql`${articleModel.id} = ${id}`)
			.fullJoin(userModel, eq(userModel.id, articleModel.userId));

		if (!result || !result.article || !result.user) {
			return null;
		}

		return {
			...result.article,
			user: result.user,
		};
	}

	async deleteOneById(id: string, userId: string): Promise<null | string> {
		const [article] = await Postgres.connection
			.delete(articleModel)
			.where(sql`${articleModel.id} = ${id} AND ${articleModel.userId} = ${userId}`)
			.returning();

		return article ? article.id : null;
	}
}
