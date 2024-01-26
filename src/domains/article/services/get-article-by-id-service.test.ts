import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { GetArticleByIdService } from 'src/domains/article/services/get-article-by-id-service';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { BookmarkPostgresRepository } from 'src/infra/databases/postgres/repositories/bookmark-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();
const articlePostgresRepository = new ArticlePostgresRepository();
const bookmarkPostgresRepository = new BookmarkPostgresRepository();

describe('GetArticleByIdService', () => {
	it('Should get an article if it exists and reader is the owner', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
		const user1 = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await articlePostgresRepository.createOne({
			title: 'titulo',
			content: 'conteudo',
			userId: user1.id,
		});

		const existingArticle = await getArticleByIdService.execute(createdArticle.id, user1.id);

		expect(existingArticle).toBeTruthy();
	});

	it('Should get an article if it exists and reader is not the owner', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
		const user1 = await userPostgresRepository.createOne({
			username: 'john1',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const user2 = await userPostgresRepository.createOne({
			username: 'john2',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await articlePostgresRepository.createOne({
			title: 'titulo',
			content: 'conteudo',
			userId: user2.id,
		});

		const existingArticle = await getArticleByIdService.execute(createdArticle.id, user1.id);

		expect(existingArticle).toBeTruthy();
	});

	it('Should get an article with its creator', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await articlePostgresRepository.createOne({
			title: 'titulo',
			content: 'conteudo',
			userId: createdUser.id,
		});

		const existingArticle = await getArticleByIdService.execute(createdArticle.id, createdUser.id);

		expect(existingArticle).toHaveProperty('user', expect.objectContaining(createdUser));
	});

	it('Should return true if the reader bookmarked the retrieved article', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
		const reader = await userPostgresRepository.createOne({
			username: 'johnreader',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const owner = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await articlePostgresRepository.createOne({
			title: 'titulo',
			content: 'conteudo',
			userId: owner.id,
		});
		await bookmarkPostgresRepository.createOne(createdArticle.id, reader.id);

		const existingArticle = await getArticleByIdService.execute(createdArticle.id, reader.id);

		expect(existingArticle.user.didBookmark).toEqual(true);
	});

	it('Should return false if the reader has not bookmarked the retrieved article', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
		const reader = await userPostgresRepository.createOne({
			username: 'johnreader',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const owner = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await articlePostgresRepository.createOne({
			title: 'titulo',
			content: 'conteudo',
			userId: owner.id,
		});

		const existingArticle = await getArticleByIdService.execute(createdArticle.id, reader.id);

		expect(existingArticle.user.didBookmark).toEqual(false);
	});

	it('Should throw an exception if the user does not exist', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);

		await expect(getArticleByIdService.execute(randomUUID(), randomUUID())).rejects.toMatchObject(
			new UserDoesNotExistException()
		);
	});

	it('Should throw an exception if the article does not exist', async () => {
		const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});

		await expect(getArticleByIdService.execute(randomUUID(), createdUser.id)).rejects.toMatchObject(
			new ArticleNotFoundException()
		);
	});
});
