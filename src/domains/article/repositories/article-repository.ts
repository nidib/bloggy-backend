import {
	InsertArticleModel,
	SelectArticleModel,
	SelectArticleWithUser,
} from 'src/infra/databases/postgres/models/article-model';

export interface ArticleRepository {
	getOneById(id: string): Promise<null | SelectArticleModel>;

	getOneByIdWithUser(id: string): Promise<null | SelectArticleWithUser>;

	createOne(candidate: InsertArticleModel): Promise<SelectArticleModel>;

	deleteOneById(id: string, userId: string): Promise<null | string>;
}
