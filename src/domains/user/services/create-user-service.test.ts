import { describe, expect, it } from 'vitest';

import { CreateUserService } from 'src/domains/user/services/create-user-service';
import { UserAlreadyExistsException } from 'src/exceptions/user-already-exists-exception';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();

describe('CreateUserService', () => {
	it('Should create an user if username does not exist yet', async () => {
		const createUserService = new CreateUserService(userPostgresRepository);
		const newUser = { username: 'johndoe', password: 'qwe123', fullName: 'John Doe' };

		const createdUser = await createUserService.execute(newUser);

		expect(await userPostgresRepository.getOneById(createdUser.id)).toBeTruthy();
	});

	it('Should create an user with hashed password', async () => {
		const createUserService = new CreateUserService(userPostgresRepository);
		const newUser = { username: 'johndoe', password: 'qwe123', fullName: 'John Doe' };

		const { password } = await createUserService.execute(newUser);

		expect(password).toBeTypeOf('string');
		expect(password).not.equal(newUser.password);
	});

	it('Should throw exception if username already exists', async () => {
		const createUserService = new CreateUserService(userPostgresRepository);
		const newUser = { username: 'johndoe', password: 'qwe123', fullName: 'John Doe' };

		const { username } = await createUserService.execute(newUser);

		await expect(
			createUserService.execute({ username, password: 'another-password', fullName: 'Another name' })
		).rejects.toMatchObject(new UserAlreadyExistsException(username));
	});
});
