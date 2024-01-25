import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { UserAlreadyExistsException } from 'src/exceptions/user-already-exists-exception';
import { Auth } from 'src/infra/auth/auth';
import { SelectUserModel } from 'src/infra/databases/postgres/models/user-model';

export class CreateUserService {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userCandidate: { username: string; password: string; fullName: string }): Promise<SelectUserModel> {
		const existingUser = await this.userRepository.getOneByUsername(userCandidate.username);

		if (existingUser) {
			throw new UserAlreadyExistsException(userCandidate.username);
		}

		const hashedPassword = await Auth.hashPassword(userCandidate.password);

		return this.userRepository.createOne({
			...userCandidate,
			password: hashedPassword,
		});
	}
}
