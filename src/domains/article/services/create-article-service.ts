import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { SelectArticleModel } from 'src/infra/databases/postgres/models/article-model';

export class CreateArticleService {
	constructor(
		private readonly articleRepository: ArticleRepository,
		private readonly userRepository: UserRepository
	) {}

	async execute(articleCandidate: { title: string; content: string }, userId: string): Promise<SelectArticleModel> {
		const existingUser = await this.userRepository.getOneById(userId);

		if (!existingUser) {
			throw new UserDoesNotExistException();
		}

		return this.articleRepository.createOne({ ...articleCandidate, userId });
	}
}
