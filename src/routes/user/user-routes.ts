import httpStatus from 'http-status-codes';
import { z } from 'zod';

import { GetUserByIdService } from 'src/domains/user/services/get-user-by-id-service';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';
import { makeProtectedRoute } from 'src/routes/protected-route';

const getUserSchemas = {
	response: z.object({
		id: z.string(),
		fullName: z.string(),
		createdAt: z.date().transform(d => d.toISOString()),
		updatedAt: z.date().transform(d => d.toISOString()),
	}),
};

export function makeUserRoutes() {
	const userPostgresRepository = new UserPostgresRepository();
	const getUserByIdService = new GetUserByIdService(userPostgresRepository);

	return makeProtectedRoute().get('/', async c => {
		const createdUser = await getUserByIdService.execute(c.get('loggedUserId'));
		const response = getUserSchemas.response.parse(createdUser);

		return c.json(response, httpStatus.CREATED);
	});
}
