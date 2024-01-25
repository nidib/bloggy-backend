import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';

export class DeleteArticleByIdService {
	constructor(private readonly articleRepository: ArticleRepository) {}

	async execute(id: string, userId: string): Promise<string> {
		const articleId = await this.articleRepository.deleteOneById(id, userId);

		if (!articleId) {
			throw new ArticleNotFoundException();
		}

		return articleId;
	}
}
