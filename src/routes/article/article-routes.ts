import httpStatus from 'http-status-codes';
import { z } from 'zod';

import { CreateArticleService } from 'src/domains/article/services/create-article-service';
import { DeleteArticleByIdService } from 'src/domains/article/services/delete-article-by-id-service';
import { GetArticleByIdService } from 'src/domains/article/services/get-article-by-id-service';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { makeProtectedRoute } from 'src/routes/protected-route';

const createArticleSchemas = {
	request: z.object({
		title: z.string(),
		content: z.string(),
	}),
	response: z.object({
		title: z.string(),
		content: z.string(),
		id: z.string(),
	}),
};

const getArticleSchemas = {
	response: z
		.object({
			id: z.string(),
			title: z.string(),
			content: z.string(),
			user: z.object({
				id: z.string(),
				username: z.string(),
				fullName: z.string(),
			}),
			createdAt: z.date(),
			updatedAt: z.date(),
		})
		.nullable(),
};

const deleteArticleSchemas = {
	response: z.object({
		id: z.string(),
	}),
};

export function makeArticleRoutes() {
	const articlePostgresRepository = new ArticlePostgresRepository();
	const createArticleService = new CreateArticleService(articlePostgresRepository);
	const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository);
	const deleteArticleByIdService = new DeleteArticleByIdService(articlePostgresRepository);

	return makeProtectedRoute()
		.post('/', async c => {
			const payload = createArticleSchemas.request.parse(await c.req.json());
			const createdArticle = await createArticleService.execute(payload, c.get('loggedUserId'));
			const response = createArticleSchemas.response.parse(createdArticle);

			return c.json(response, httpStatus.OK);
		})
		.get('/:id', async c => {
			const articleId = c.req.param('id');
			const article = await getArticleByIdService.execute(articleId);
			const response = getArticleSchemas.response.parse(article);

			return c.json(response, response ? httpStatus.OK : httpStatus.NOT_FOUND);
		})
		.delete('/:id', async c => {
			const articleId = c.req.param('id');
			const loggedUserId = c.get('loggedUserId');
			const deletedArticleId = await deleteArticleByIdService.execute(articleId, loggedUserId);
			const response = deleteArticleSchemas.response.parse({ id: deletedArticleId });

			return c.json(response, httpStatus.OK);
		});
}
