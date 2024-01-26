import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { ToggleBookmarkService } from 'src/domains/bookmark/services/toggle-bookmark-service';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { BookmarkPostgresRepository } from 'src/infra/databases/postgres/repositories/bookmark-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const bookmarkRepository = new BookmarkPostgresRepository();
const userRepository = new UserPostgresRepository();
const articleRepository = new ArticlePostgresRepository();

describe('ToggleBookmarkSerivce', () => {
	it('Should return true if an article is bookmarked for the first time', async () => {
		const toggleBookmarkSerivce = new ToggleBookmarkService(bookmarkRepository, articleRepository);
		const user = await userRepository.createOne({ username: 'johndoe', password: 'qwe123', fullName: 'John Doe' });
		const article = await articleRepository.createOne({ title: 'titulo', content: 'content', userId: user.id });

		const isBookMarked = await toggleBookmarkSerivce.execute(article.id, user.id);

		expect(isBookMarked).toEqual(true);
		expect(await bookmarkRepository.getOne(article.id, user.id)).toBeTruthy();
	});

	it('Should return false if an article was already bookmarked', async () => {
		const toggleBookmarkSerivce = new ToggleBookmarkService(bookmarkRepository, articleRepository);
		const user = await userRepository.createOne({ username: 'johndoe', password: 'qwe123', fullName: 'John Doe' });
		const article = await articleRepository.createOne({ title: 'titulo', content: 'content', userId: user.id });
		await toggleBookmarkSerivce.execute(article.id, user.id);

		const isBookMarked = await toggleBookmarkSerivce.execute(article.id, user.id);

		expect(isBookMarked).toEqual(false);
		expect(await bookmarkRepository.getOne(article.id, user.id)).toBeNull();
	});

	it('Should throw exception if article does not exist', async () => {
		const toggleBookmarkSerivce = new ToggleBookmarkService(bookmarkRepository, articleRepository);
		const user = await userRepository.createOne({ username: 'johndoe', password: 'qwe123', fullName: 'John Doe' });

		expect(toggleBookmarkSerivce.execute(randomUUID(), user.id)).rejects.toMatchObject(
			new ArticleNotFoundException()
		);
	});
});
