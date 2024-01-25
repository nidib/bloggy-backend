import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { SelectArticleWithUser } from 'src/infra/databases/postgres/models/article-model';

export class GetArticleByIdService {
	constructor(private readonly articleRepository: ArticleRepository) {}

	async execute(id: string): Promise<SelectArticleWithUser> {
		const article = await this.articleRepository.getOneByIdWithUser(id);

		if (!article) {
			throw new ArticleNotFoundException();
		}

		return article;
	}
}
