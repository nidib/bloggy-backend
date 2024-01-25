import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { SelectArticleModel } from 'src/infra/databases/postgres/models/article-model';

export class CreateArticleService {
	constructor(private readonly articleRepository: ArticleRepository) {}

	async execute(articleCandidate: { title: string; content: string }, userId: string): Promise<SelectArticleModel> {
		return this.articleRepository.createOne({ ...articleCandidate, userId });
	}
}
