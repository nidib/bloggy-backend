import { describe, expect, it, vi } from 'vitest';

import { LoginUserService } from 'src/domains/user/services/login-user-service';
import { UserOrPasswordIncorrectException } from 'src/exceptions/user-password-incorrect-exception';
import { Auth } from 'src/infra/auth/auth';

function makeUserRepositoryMock() {
	return {
		getOneByUsername: vi.fn().mockResolvedValue(null),
		createOne: vi.fn(),
		getOneById: vi.fn(),
	};
}

describe('LoginUserService', () => {
	it('Should return a token if the user exists and password is valid', async () => {
		const userRepositoryMock = makeUserRepositoryMock();
		const loginUserService = new LoginUserService(userRepositoryMock);
		const plainPassword = 'qwe123';
		const existingUser = {
			id: '64645153-f60c-4614-bd7b-a8b7bca7292f',
			username: 'johndoe',
			password: await Auth.hashPassword(plainPassword),
			fullName: 'John Doe',
		};
		const userToBeLoggedIn = { ...existingUser, password: plainPassword };
		userRepositoryMock.getOneByUsername = vi.fn().mockResolvedValue(existingUser);

		const token = await loginUserService.execute({
			username: userToBeLoggedIn.username,
			password: userToBeLoggedIn.password,
		});

		expect(token).toBeTypeOf('string');
	});

	it('Should throw an exception if the username is invalid', async () => {
		const userRepositoryMock = makeUserRepositoryMock();
		const loginUserService = new LoginUserService(userRepositoryMock);
		const plainPassword = 'qwe123';
		const existingUser = {
			id: '64645153-f60c-4614-bd7b-a8b7bca7292f',
			username: 'johndoe',
			password: await Auth.hashPassword(plainPassword),
			fullName: 'John Doe',
		};
		userRepositoryMock.getOneByUsername = vi.fn().mockResolvedValue(null);

		expect(
			loginUserService.execute({ username: existingUser.username, password: plainPassword })
		).rejects.toMatchObject(new UserOrPasswordIncorrectException());
	});

	it('Should throw an exception if the password is invalid', async () => {
		const userRepositoryMock = makeUserRepositoryMock();
		const loginUserService = new LoginUserService(userRepositoryMock);
		const plainPassword = 'qwe123';
		const existingUser = {
			id: '64645153-f60c-4614-bd7b-a8b7bca7292f',
			username: 'johndoe',
			password: await Auth.hashPassword(plainPassword),
			fullName: 'John Doe',
		};
		userRepositoryMock.getOneByUsername = vi.fn().mockResolvedValue(existingUser);
		const userToBeLoggedIn = { ...existingUser, password: plainPassword };

		expect(
			loginUserService.execute({ username: userToBeLoggedIn.username, password: 'qwe1234' })
		).rejects.toMatchObject(new UserOrPasswordIncorrectException());
	});
});
