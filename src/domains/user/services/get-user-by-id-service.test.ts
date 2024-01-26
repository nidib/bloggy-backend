import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { GetUserByIdService } from 'src/domains/user/services/get-user-by-id-service';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { UserPostgresRepository } from 'src/infra/databases/postgres/repositories/user-postgres-repository';

const userPostgresRepository = new UserPostgresRepository();

describe('GetUserByIdService', () => {
	it('Should return user if exists', async () => {
		const getUserByIdService = new GetUserByIdService(userPostgresRepository);
		const createdUser = await userPostgresRepository.createOne({
			username: 'johndoe',
			password: 'qwe123',
			fullName: 'john doe',
		});

		const existingUser = await getUserByIdService.execute(createdUser.id);

		expect(existingUser).toBeTruthy();
	});

	it('Should not return user if does not exist', async () => {
		const getUserByIdService = new GetUserByIdService(userPostgresRepository);

		expect(getUserByIdService.execute(randomUUID())).rejects.toMatchObject(new UserDoesNotExistException());
	});
});
