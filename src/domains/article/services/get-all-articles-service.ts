import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { SelectArticleWithUser } from 'src/infra/databases/postgres/models/article-model';

type Filters = { order: 'asc' | 'desc'; userId?: string };

export class GetAllArticlesService {
	constructor(
		private readonly articleRepository: ArticleRepository,
		private readonly userRepository: UserRepository
	) {}

	async execute(userId: string, filters: Filters): Promise<SelectArticleWithUser[]> {
		const existingUser = await this.userRepository.getOneById(userId);

		if (!existingUser) {
			throw new UserDoesNotExistException();
		}

		return this.articleRepository.getMany(userId, filters);
	}
}
