import { Hono } from 'hono';
import httpStatus from 'http-status-codes';
import { z } from 'zod';

import { CreateUserService } from 'src/domains/user/services/create-user-service';
import { LoginUserService } from 'src/domains/user/services/login-user-service';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const registerUserSchemas = {
	request: z.object({
		username: z.string(),
		password: z.string(),
		fullName: z.string(),
	}),
	response: z.object({
		id: z.string(),
		username: z.string(),
		fullName: z.string(),
	}),
};

const loginUserSchemas = {
	request: z.object({
		username: z.string(),
		password: z.string(),
	}),
	response: z.object({
		id: z.string(),
		token: z.string(),
	}),
};

export function makeAuthRoutes() {
	const routes = new Hono();
	const userPostgresRepository = new UserPostgresRepository();
	const createUserService = new CreateUserService(userPostgresRepository);
	const loginUserService = new LoginUserService(userPostgresRepository);

	routes.post('/register', async c => {
		const payload = registerUserSchemas.request.parse(await c.req.json());
		const createdUser = await createUserService.execute(payload);
		const response = registerUserSchemas.response.parse(createdUser);

		return c.json(response, httpStatus.OK);
	});

	routes.post('/login', async c => {
		const payload = loginUserSchemas.request.parse(await c.req.json());
		const { token, userId } = await loginUserService.execute(payload);
		const response = loginUserSchemas.response.parse({ token, id: userId });

		return c.json(response, httpStatus.OK);
	});

	return routes;
}
