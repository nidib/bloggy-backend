import { describe, expect, it } from 'vitest';

import { CreateUserService } from 'src/domains/user/services/create-user-service';
import { LoginUserService } from 'src/domains/user/services/login-user-service';
import { UserOrPasswordIncorrectException } from 'src/exceptions/user-password-incorrect-exception';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();

describe('LoginUserService', () => {
	it('Should return a token if the user exists and password is valid', async () => {
		const loginUserService = new LoginUserService(userPostgresRepository);
		const createUserService = new CreateUserService(userPostgresRepository);
		const username = 'johndoe';
		const password = 'qwe123';
		const createdUser = await createUserService.execute({
			username,
			password,
			fullName: 'John Doe',
		});

		const result = await loginUserService.execute({
			username,
			password,
		});

		expect(result).toEqual({
			token: expect.any(String),
			userId: createdUser.id,
		});
	});

	it('Should throw an exception if the username is invalid', async () => {
		const loginUserService = new LoginUserService(userPostgresRepository);
		const createUserService = new CreateUserService(userPostgresRepository);
		const password = 'qwe123';
		await createUserService.execute({
			username: 'johndoe',
			password,
			fullName: 'John Doe',
		});

		await expect(loginUserService.execute({ username: 'doejohn', password })).rejects.toMatchObject(
			new UserOrPasswordIncorrectException()
		);
	});

	it('Should throw an exception if the password is invalid', async () => {
		const loginUserService = new LoginUserService(userPostgresRepository);
		const createUserService = new CreateUserService(userPostgresRepository);
		const username = 'johndoe';
		await createUserService.execute({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'John Doe',
		});

		await expect(loginUserService.execute({ username, password: '123qwe' })).rejects.toMatchObject(
			new UserOrPasswordIncorrectException()
		);
	});
});
