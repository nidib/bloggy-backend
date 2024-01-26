import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { UpdateArticleByIdService } from 'src/domains/article/services/update-article-by-id-service';
import { ArticleNotFoundException } from 'src/exceptions/article-not-found-exception';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const articlePostgresRepository = new ArticlePostgresRepository();
const userPostgresRepository = new UserPostgresRepository();

describe('UpdateArticleByIdService', () => {
	it('Should update an article that belongs to an user', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
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
		const soonToBeUpdatedArticle = {
			title: 'titulo 2',
			content: 'conteudo 2',
		};

		const updatedArticle = await updateArticleByIdService.execute(
			createdArticle.id,
			createdUser.id,
			soonToBeUpdatedArticle
		);

		expect(updatedArticle).toMatchObject(soonToBeUpdatedArticle);
		expect(await articlePostgresRepository.getOneById(createdArticle.id)).toMatchObject(soonToBeUpdatedArticle);
	});

	it('Should keep the same id value', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
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
		const soonToBeUpdatedArticle = {
			title: 'titulo 2',
			content: 'conteudo 2',
		};

		const updatedArticle = await updateArticleByIdService.execute(
			createdArticle.id,
			createdUser.id,
			soonToBeUpdatedArticle
		);

		expect(createdArticle.id).toEqual(updatedArticle.id);
	});

	it('Should keep the same userId value', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
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
		const soonToBeUpdatedArticle = {
			title: 'titulo 2',
			content: 'conteudo 2',
		};

		const updatedArticle = await updateArticleByIdService.execute(
			createdArticle.id,
			createdUser.id,
			soonToBeUpdatedArticle
		);

		expect(createdArticle.userId).toEqual(updatedArticle.userId);
	});

	it('Should keep the same createdAt value', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
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
		const soonToBeUpdatedArticle = {
			title: 'titulo 2',
			content: 'conteudo 2',
		};

		const updatedArticle = await updateArticleByIdService.execute(
			createdArticle.id,
			createdUser.id,
			soonToBeUpdatedArticle
		);

		expect(createdArticle.createdAt).toEqual(updatedArticle.createdAt);
	});

	it('Should keep the same updatedAt', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
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
		const soonToBeUpdatedArticle = {
			title: 'titulo 2',
			content: 'conteudo 2',
		};

		const updatedArticle = await updateArticleByIdService.execute(
			createdArticle.id,
			createdUser.id,
			soonToBeUpdatedArticle
		);

		expect(createdArticle.updatedAt).toEqual(updatedArticle.updatedAt);
	});

	it('Should throw an exception if an user tries to update an article that belongs to another user', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
		const reader = await userPostgresRepository.createOne({
			username: 'reader',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const owner = await userPostgresRepository.createOne({
			username: 'owner',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await articlePostgresRepository.createOne({
			title: 'titulo',
			content: 'conteudo',
			userId: owner.id,
		});
		const soonToBeUpdatedArticle = {
			title: 'titulo 2',
			content: 'conteudo 2',
		};

		await expect(
			updateArticleByIdService.execute(createdArticle.id, reader.id, soonToBeUpdatedArticle)
		).rejects.toMatchObject(new ArticleNotFoundException());
		expect(await articlePostgresRepository.getOneById(createdArticle.id)).toMatchObject(createdArticle);
	});

	it('Should throw an exception when trying to update an article with a non existing user', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);

		await expect(
			updateArticleByIdService.execute(randomUUID(), randomUUID(), {
				title: 'titulo 2',
				content: 'conteudo 2',
			})
		).rejects.toMatchObject(new UserDoesNotExistException());
	});

	it('Should throw an exception when trying to update a non existing article', async () => {
		const updateArticleByIdService = new UpdateArticleByIdService(
			articlePostgresRepository,
			userPostgresRepository
		);
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});

		await expect(
			updateArticleByIdService.execute(randomUUID(), createdUser.id, {
				title: 'titulo 2',
				content: 'conteudo 2',
			})
		).rejects.toMatchObject(new ArticleNotFoundException());
	});
});
