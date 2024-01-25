import { describe, expect, it, vi } from 'vitest';

import { CreateUserService } from 'src/domains/user/services/create-user-service';
import { UserAlreadyExistsException } from 'src/exceptions/user-already-exists-exception';

function makeUserRepositoryMock() {
	return {
		getOneByUsername: vi.fn().mockResolvedValue(null),
		createOne: vi.fn(),
	};
}

describe('CreateUserService', () => {
	it('Should create an user if username does not exist yet', async () => {
		const userRepositoryMock = makeUserRepositoryMock();
		const createUserService = new CreateUserService(userRepositoryMock);
		const newUser = { username: 'johndoe', password: 'qwe123', fullName: 'John Doe' };

		await createUserService.execute(newUser);

		expect(userRepositoryMock.createOne).toHaveBeenCalledTimes(1);
		expect(userRepositoryMock.createOne).toHaveBeenCalledWith(
			expect.objectContaining({
				username: newUser.username,
				fullName: 'John Doe',
			})
		);
	});

	it('Should create an user if username with hashed password', async () => {
		const userRepositoryMock = makeUserRepositoryMock();
		const createUserService = new CreateUserService(userRepositoryMock);
		const newUser = { username: 'johndoe', password: 'qwe123', fullName: 'John Doe' };

		await createUserService.execute(newUser);

		expect(userRepositoryMock.createOne).toHaveBeenCalledTimes(1);
		expect(userRepositoryMock.createOne).toHaveBeenCalledWith(
			expect.objectContaining({
				password: expect.not.stringMatching(newUser.password),
			})
		);
	});

	it('Should throw exception if username already exists', async () => {
		const userRepositoryMock = makeUserRepositoryMock();
		const createUserService = new CreateUserService(userRepositoryMock);
		const newUser = { username: 'johndoe', password: 'qwe123', fullName: 'John Doe' };
		const existingUser = { ...newUser, id: 'b1c2e1a4-e590-4af0-a77e-c23480e15481' };
		userRepositoryMock.getOneByUsername = vi.fn().mockResolvedValue(existingUser);

		await expect(createUserService.execute(newUser)).rejects.toMatchObject(
			new UserAlreadyExistsException(existingUser.username)
		);
	});
});
