import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { CreateArticleService } from 'src/domains/article/services/create-article-service';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();
const articlePostgresRepository = new ArticlePostgresRepository();

describe('CreateArticleService', () => {
	it('Should create an article if user exists', async () => {
		const createArticleService = new CreateArticleService(articlePostgresRepository, userPostgresRepository);
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const createdArticle = await createArticleService.execute(
			{
				title: 'titulo',
				content: 'conteudo',
			},
			createdUser.id
		);

		const existingArticle = await articlePostgresRepository.getOneByIdAndUser(createdArticle.id, createdUser.id);

		expect(existingArticle).toBeTruthy();
	});

	it('Should throw an exception when creating an article and the user does not exist', async () => {
		const userId = randomUUID();
		const createArticleService = new CreateArticleService(articlePostgresRepository, userPostgresRepository);

		await expect(
			createArticleService.execute(
				{
					title: 'titulo',
					content: 'conteudo',
				},
				userId
			)
		).rejects.toMatchObject(new UserDoesNotExistException());
	});
});
