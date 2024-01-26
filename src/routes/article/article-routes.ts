import httpStatus from 'http-status-codes';
import { z } from 'zod';

import { CreateArticleService } from 'src/domains/article/services/create-article-service';
import { DeleteArticleByIdService } from 'src/domains/article/services/delete-article-by-id-service';
import { GetArticleByIdService } from 'src/domains/article/services/get-article-by-id-service';
import { UpdateArticleByIdService } from 'src/domains/article/services/update-article-by-id-service';
import { ToggleBookmarkService } from 'src/domains/bookmark/services/toggle-bookmark-service';
import { ArticlePostgresRepository } from 'src/infra/databases/postgres/repositories/article-postgres-repository';
import { BookmarkPostgresRepository } from 'src/infra/databases/postgres/repositories/bookmark-postgres-repository';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';
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
				didBookmark: z.boolean(),
			}),
			createdAt: z.date(),
			updatedAt: z.date(),
		})
		.nullable(),
};

const getAllArticlesSchemas = {
	request: z.object({
		order: z.enum(['asc', 'desc']),
		userId: z.string().optional(),
	}),
	response: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			content: z.string(),
			user: z.object({
				id: z.string(),
				username: z.string(),
				fullName: z.string(),
				didBookmark: z.boolean(),
			}),
			createdAt: z.date(),
			updatedAt: z.date(),
		})
	),
};

const updateArticleSchemas = {
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

const toggleBookmarkSchemas = {
	response: z.object({
		isBookmarked: z.boolean(),
	}),
};

const deleteArticleSchemas = {
	response: z.object({
		id: z.string(),
	}),
};

export function makeArticleRoutes() {
	const userPostgresRepository = new UserPostgresRepository();
	const articlePostgresRepository = new ArticlePostgresRepository();
	const bookmarkPostgresRepository = new BookmarkPostgresRepository();
	const createArticleService = new CreateArticleService(articlePostgresRepository, userPostgresRepository);
	const getArticleByIdService = new GetArticleByIdService(articlePostgresRepository, userPostgresRepository);
	const deleteArticleByIdService = new DeleteArticleByIdService(articlePostgresRepository, userPostgresRepository);
	const updateArticleByIdService = new UpdateArticleByIdService(articlePostgresRepository, userPostgresRepository);
	const toggleBookmarkService = new ToggleBookmarkService(
		bookmarkPostgresRepository,
		articlePostgresRepository,
		userPostgresRepository
	);

	return makeProtectedRoute()
		.post('/', async c => {
			const payload = createArticleSchemas.request.parse(await c.req.json());
			const createdArticle = await createArticleService.execute(payload, c.get('loggedUserId'));
			const response = createArticleSchemas.response.parse(createdArticle);

			return c.json(response, httpStatus.CREATED);
		})

		.get('/:id', async c => {
			const articleId = c.req.param('id');
			const loggedUserId = c.get('loggedUserId');
			const article = await getArticleByIdService.execute(articleId, loggedUserId);
			const response = getArticleSchemas.response.parse(article);

			return c.json(response, response ? httpStatus.OK : httpStatus.NOT_FOUND);
		})
		.put('/:id', async c => {
			const articleId = c.req.param('id');
			const loggedUserId = c.get('loggedUserId');
			const payload = updateArticleSchemas.request.parse(await c.req.json());
			const updatedArticle = await updateArticleByIdService.execute(articleId, loggedUserId, payload);
			const response = updateArticleSchemas.response.parse(updatedArticle);

			return c.json(response, response ? httpStatus.OK : httpStatus.OK);
		})
		.delete('/:id', async c => {
			const articleId = c.req.param('id');
			const loggedUserId = c.get('loggedUserId');
			const deletedArticleId = await deleteArticleByIdService.execute(articleId, loggedUserId);
			const response = deleteArticleSchemas.response.parse({ id: deletedArticleId });

			return c.json(response, httpStatus.OK);
		})
		.post('/:id/bookmark', async c => {
			const articleId = c.req.param('id');
			const loggedUserId = c.get('loggedUserId');
			const isBookmarked = await toggleBookmarkService.execute(articleId, loggedUserId);
			const response = toggleBookmarkSchemas.response.parse({ isBookmarked });

			return c.json(response, httpStatus.OK);
		});
}
