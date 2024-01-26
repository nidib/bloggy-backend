import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';

export class DeleteArticleByIdService {
	constructor(
		private readonly articleRepository: ArticleRepository,
		private readonly userRepository: UserRepository
	) {}

	async execute(id: string, userId: string): Promise<string> {
		const existingUser = await this.userRepository.getOneById(userId);

		if (!existingUser) {
			throw new UserDoesNotExistException();
		}

		const articleId = await this.articleRepository.deleteOne(id, userId);

		if (!articleId) {
			throw new ArticleNotFoundException();
		}

		return articleId;
	}
}
