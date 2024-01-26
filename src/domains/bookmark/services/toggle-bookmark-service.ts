import { ArticleRepository } from 'src/domains/article/repositories/article-repository';
import { BookmarkRepository } from 'src/domains/bookmark/repositories/bookmark-repository';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';

export class ToggleBookmarkService {
	constructor(
		private readonly bookmarkRepository: BookmarkRepository,
		private readonly articleRepository: ArticleRepository
	) {}

	async execute(articleId: string, userId: string): Promise<boolean> {
		const existingArticle = await this.articleRepository.getOneById(articleId);
		if (!existingArticle) {
			throw new ArticleNotFoundException();
		}

		const existingBookmark = await this.bookmarkRepository.getOne(articleId, userId);

		if (existingBookmark) {
			await this.bookmarkRepository.deleteOne(articleId, userId);
		} else {
			await this.bookmarkRepository.createOne(articleId, userId);
		}

		return !Boolean(existingBookmark);
	}
}
