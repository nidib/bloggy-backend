import {
	InsertArticleModel,
	SelectArticleModel,
	SelectArticleWithUser,
} from 'src/infra/databases/postgres/models/article-model';

export interface ArticleRepository {
	getOneById(id: string): Promise<null | SelectArticleModel>;

	getOneByIdAndUser(id: string, userId: string): Promise<null | SelectArticleModel>;

	updateOne(id: string, userId: string, article: InsertArticleModel): Promise<SelectArticleModel>;

	getOneByIdWithUser(id: string, userId: string): Promise<null | SelectArticleWithUser>;

	createOne(candidate: InsertArticleModel): Promise<SelectArticleModel>;

	deleteOne(id: string, userId: string): Promise<null | string>;

	getMany(
		loggedUserId: string,
		filters: { order: 'asc' | 'desc'; userId?: string; queryOffset: number }
	): Promise<SelectArticleWithUser[]>;
}
