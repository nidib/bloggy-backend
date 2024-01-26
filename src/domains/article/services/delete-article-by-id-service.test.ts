import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { DeleteArticleByIdService } from 'src/domains/article/services/delete-article-by-id-service';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();
const articlePostgresRepository = new ArticlePostgresRepository();

describe('DeleteArticleByIdService', () => {
	it('Should delete an article if it exists', async () => {
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
		const deleteArticleByIdService = new DeleteArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);

		await deleteArticleByIdService.execute(createdArticle.id, createdUser.id);

		expect(await articlePostgresRepository.getOneByIdAndUser(createdArticle.id, createdUser.id)).toBeNull();
	});

	it('Should throw an excepition if article does not exist', async () => {
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const deleteArticleByIdService = new DeleteArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);

		await expect(deleteArticleByIdService.execute(randomUUID(), createdUser.id)).rejects.toMatchObject(
			new ArticleNotFoundException()
		);
	});

	it('Should throw an excepition if user does not exist', async () => {
		const deleteArticleByIdService = new DeleteArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);

		await expect(deleteArticleByIdService.execute(randomUUID(), randomUUID())).rejects.toMatchObject(
			new UserDoesNotExistException()
		);
	});

	it('Should throw an exception if an user tries to delete an article that belongs to another user', async () => {
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
			userId: user1.id,
		});
		const deleteArticleByIdService = new DeleteArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);

		await expect(deleteArticleByIdService.execute(createdArticle.id, user2.id)).rejects.toMatchObject(
			new ArticleNotFoundException()
		);
	});
});
