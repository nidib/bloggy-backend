import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { AuthenticationService } from 'src/domains/auth/authentication-service';
import { UnauthorizedException } from 'src/exceptions/unauthorized-exception';
import { Auth } from 'src/infra/auth/auth';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();

describe('AuthenticationService', () => {
	it('Should authenticate an user if username and password are correct', async () => {
		const authenticationService = new AuthenticationService(userPostgresRepository);
		const existingUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});
		const token = await Auth.makeAuthToken(existingUser.id);

		const authenticatedUserId = await authenticationService.execute(`Bearer ${token}`);

		expect(authenticatedUserId).toEqual(existingUser.id);
	});

	it('Should throw an exception if the provided bearer token is invalid', async () => {
		const authenticationService = new AuthenticationService(userPostgresRepository);

		await expect(authenticationService.execute('')).rejects.toMatchObject(new UnauthorizedException());
		await expect(authenticationService.execute('Bearer')).rejects.toMatchObject(new UnauthorizedException());
	});

	it('Should throw an exception if the provided bearer token not a jwt', async () => {
		const authenticationService = new AuthenticationService(userPostgresRepository);

		await expect(authenticationService.execute('Bearer xpto')).rejects.toMatchObject(new UnauthorizedException());
	});

	it('Should throw an exception if the user does not exist anymore', async () => {
		const authenticationService = new AuthenticationService(userPostgresRepository);
		const tokenOfARandomUUID = await Auth.makeAuthToken(randomUUID());

		await expect(authenticationService.execute(`Bearer ${tokenOfARandomUUID}`)).rejects.toMatchObject(
			new UnauthorizedException()
		);
	});
});
