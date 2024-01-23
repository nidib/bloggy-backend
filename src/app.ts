import { Hono } from 'hono';
import httpStatus from 'http-status-codes';
import { ZodError } from 'zod';

import { ApiException } from 'src/exceptions/api-exception';
import { RouteNotFoundException } from 'src/exceptions/route-not-found-exception';

export function makeApp() {
	const app = new Hono();

	app.onError((e, c) => {
		if (e instanceof ApiException) {
			return c.json({ message: e.message }, e.code);
		}

		if (e instanceof ZodError) {
			const { fieldErrors } = e.flatten();

			return c.json({ message: 'Validation error', fieldErrors }, httpStatus.BAD_REQUEST);
		}

		const uncaughtError = new ApiException('Algo deu errado');

		return c.json({ message: uncaughtError.message }, uncaughtError.code);
	});

	app.notFound(() => {
		throw new RouteNotFoundException();
	});

	return app;
}
