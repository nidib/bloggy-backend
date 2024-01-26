import { randomUUID } from 'crypto';
import { sub } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { GetAllArticlesService } from 'src/domains/article/services/get-all-articles-service';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { BookmarkPostgresRepository } from 'src/infra/databases/postgres/repositories/bookmark-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const articlePostgresRepository = new ArticlePostgresRepository();
const userPostgresRepository = new UserPostgresRepository();
const bookmarkPostgresRepository = new BookmarkPostgresRepository();

describe('GetAllArticlesService', () => {
	it('Should get an empty list if there are no articles', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});

		const articles = await getAllArticlesService.execute(createdUser.id, { order: 'asc' });

		expect(articles).toHaveLength(0);
	});

	it('Should get all existing articles', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);
		const user1 = await userPostgresRepository.createOne({
			username: 'johndoe1',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'title 1',
			content: 'content 1',
			userId: user1.id,
		});
		const user2 = await userPostgresRepository.createOne({
			username: 'johndoe2',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'title 2',
			content: 'content 2',
			userId: user2.id,
		});
		const user3 = await userPostgresRepository.createOne({
			username: 'johndoe3',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'title 3',
			content: 'content 3',
			userId: user3.id,
		});
		const user4 = await userPostgresRepository.createOne({
			username: 'johndoe4',
			password: 'qwe123',
			fullName: 'John Doe',
		});

		const articles = await getAllArticlesService.execute(user4.id, {
			order: 'asc',
		});

		expect(articles).toHaveLength(3);
	});

	it('Should get all existing articles ordered by createdAt asc', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);
		const today = new Date();
		const reader = await userPostgresRepository.createOne({
			username: 'reader',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const user1 = await userPostgresRepository.createOne({
			username: 'johndoe1',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const user2 = await userPostgresRepository.createOne({
			username: 'johndoe2',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'ontem',
			content: 'content ontem',
			userId: user1.id,
			createdAt: sub(today, { days: 1 }),
		});
		await articlePostgresRepository.createOne({
			title: 'anteontem',
			content: 'content anteontem',
			userId: user2.id,
			createdAt: sub(today, { days: 2 }),
		});
		await articlePostgresRepository.createOne({
			title: 'hoje',
			content: 'content hoje',
			userId: user2.id,
			createdAt: today,
		});

		const articles = await getAllArticlesService.execute(reader.id, { order: 'asc' });

		expect(articles.map(article => article.title)).toEqual(['anteontem', 'ontem', 'hoje']);
	});

	it('Should get all existing articles ordered by createdAt desc', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);
		const today = new Date();
		const reader = await userPostgresRepository.createOne({
			username: 'reader',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const user1 = await userPostgresRepository.createOne({
			username: 'johndoe1',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const user2 = await userPostgresRepository.createOne({
			username: 'johndoe2',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'ontem',
			content: 'content ontem',
			userId: user1.id,
			createdAt: sub(today, { days: 1 }),
		});
		await articlePostgresRepository.createOne({
			title: 'anteontem',
			content: 'content anteontem',
			userId: user2.id,
			createdAt: sub(today, { days: 2 }),
		});
		await articlePostgresRepository.createOne({
			title: 'hoje',
			content: 'content hoje',
			userId: user2.id,
			createdAt: today,
		});

		const articles = await getAllArticlesService.execute(reader.id, { order: 'desc' });

		expect(articles.map(article => article.title)).toEqual(['hoje', 'ontem', 'anteontem']);
	});

	it('Should get all existing articles of a specific user', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);
		const user1 = await userPostgresRepository.createOne({
			username: 'johndoe1',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'title 1',
			content: 'content 1',
			userId: user1.id,
		});
		await articlePostgresRepository.createOne({
			title: 'another title 1',
			content: 'another content 1',
			userId: user1.id,
		});
		const user2 = await userPostgresRepository.createOne({
			username: 'johndoe2',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		await articlePostgresRepository.createOne({
			title: 'title 2',
			content: 'content 2',
			userId: user2.id,
		});
		await articlePostgresRepository.createOne({
			title: 'another title 2',
			content: 'another content 2',
			userId: user2.id,
		});
		await articlePostgresRepository.createOne({
			title: 'another another title 2',
			content: 'another another content 2',
			userId: user2.id,
		});
		const user3 = await userPostgresRepository.createOne({
			username: 'johndoe3',
			password: 'qwe123',
			fullName: 'John Doe',
		});

		const articlesOfUser1 = await getAllArticlesService.execute(user2.id, {
			order: 'asc',
			userId: user1.id,
		});
		const articlesOfUser2 = await getAllArticlesService.execute(user3.id, {
			order: 'asc',
			userId: user2.id,
		});
		const articlesOfUser3 = await getAllArticlesService.execute(user1.id, {
			order: 'asc',
			userId: user3.id,
		});

		expect(articlesOfUser1).toHaveLength(2);
		expect(articlesOfUser2).toHaveLength(3);
		expect(articlesOfUser3).toHaveLength(0);
	});

	it('Should get didBookmark according to the bookmarked articles', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);
		const user1 = await userPostgresRepository.createOne({
			username: 'johndoe1',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const article1 = await articlePostgresRepository.createOne({
			title: 'title 1',
			content: 'content 1',
			userId: user1.id,
		});
		const user2 = await userPostgresRepository.createOne({
			username: 'johndoe2',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const article2 = await articlePostgresRepository.createOne({
			title: 'title 2',
			content: 'content 1',
			userId: user2.id,
		});
		const article3 = await articlePostgresRepository.createOne({
			title: 'title 3',
			content: 'content 1',
			userId: user2.id,
		});
		await bookmarkPostgresRepository.createOne(article2.id, user1.id);
		await bookmarkPostgresRepository.createOne(article1.id, user2.id);
		await bookmarkPostgresRepository.createOne(article3.id, user2.id);

		const user1ReaderArticles = await getAllArticlesService.execute(user1.id, {
			order: 'asc',
		});
		const user2ReaderArticles = await getAllArticlesService.execute(user2.id, {
			order: 'asc',
		});

		expect(user1ReaderArticles.map(article => article.user.didBookmark)).toEqual([false, true, false]);
		expect(user2ReaderArticles.map(article => article.user.didBookmark)).toEqual([true, false, true]);
	});

	it('Should throw an exception if the user does not exist', async () => {
		const getAllArticlesService = new GetAllArticlesService(articlePostgresRepository, userPostgresRepository);

		await expect(
			getAllArticlesService.execute(randomUUID(), {
				order: 'asc',
			})
		).rejects.toMatchObject(new UserDoesNotExistException());
	});
});
