import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { UserDoesNotExistException } from 'src/exceptions/user-does-not-exist-exception';
import { SelectUserModel } from 'src/infra/databases/postgres/models/user-model';

export class GetUserByIdService {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(id: string): Promise<SelectUserModel> {
		const user = await this.userRepository.getOneById(id);

		if (!user) {
			throw new UserDoesNotExistException();
		}

		return user;
	}
}
