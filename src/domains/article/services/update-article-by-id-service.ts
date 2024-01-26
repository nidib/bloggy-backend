import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { SelectArticleModel } from 'src/infra/databases/postgres/models/article-model';

export class UpdateArticleByIdService {
	constructor(
		private readonly articleRepository: ArticleRepository,
		private readonly userRepository: UserRepository
	) {}

	async execute(
		articleId: string,
		userId: string,
		article: { title: string; content: string }
	): Promise<SelectArticleModel> {
		const existingUser = await this.userRepository.getOneById(userId);

		if (!existingUser) {
			throw new UserDoesNotExistException();
		}

		const existingArticle = await this.articleRepository.getOneByIdAndUser(articleId, userId);

		if (!existingArticle) {
			throw new ArticleNotFoundException();
		}

		const articleToBeUpdated = {
			...article,
			id: existingArticle.id,
			userId: existingArticle.userId,
			createdAt: existingArticle.createdAt,
			updatedAt: existingArticle.updatedAt,
			deletedAt: existingArticle.deletedAt,
		};

		return this.articleRepository.updateOne(articleId, userId, articleToBeUpdated);
	}
}
