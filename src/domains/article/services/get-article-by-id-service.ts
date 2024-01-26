import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { SelectArticleWithUser } from 'src/infra/databases/postgres/models/article-model';

export class GetArticleByIdService {
	constructor(
		private readonly articleRepository: ArticleRepository,
		private readonly userRepository: UserRepository
	) {}

	async execute(id: string, userId: string): Promise<SelectArticleWithUser> {
		const existingUser = await this.userRepository.getOneById(userId);

		if (!existingUser) {
			throw new UserDoesNotExistException();
		}

		const article = await this.articleRepository.getOneByIdWithUser(id, userId);

		if (!article) {
			throw new ArticleNotFoundException();
		}

		return article;
	}
}
