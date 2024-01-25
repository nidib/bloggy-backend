import { Hono } from 'hono';

import { AuthenticationService } from 'src/domains/auth/authentication-service';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

export function makeProtectedRoute() {
	const route = new Hono<{ Variables: { loggedUserId: string } }>();
	const userRepository = new UserPostgresRepository();
	const authenticationService = new AuthenticationService(userRepository);

	return route.use('*', async (c, next) => {
		const authHeaderValue = c.req.header('authorization');

		const userId = await authenticationService.execute(authHeaderValue);

		c.set('loggedUserId', userId);

		await next();
	});
}
