import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { UserOrPasswordIncorrectException } from 'src/exceptions/user-password-incorrect-exception';
import { Auth } from 'src/infra/auth/auth';

export class LoginUserService {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userCandidate: { username: string; password: string }): Promise<string> {
		const existingUser = await this.userRepository.getOneByUsername(userCandidate.username);

		if (!existingUser) {
			throw new UserOrPasswordIncorrectException();
		}

		const passwordIsCorrect = await Auth.validatePassword(userCandidate.password, existingUser.password);

		if (!passwordIsCorrect) {
			throw new UserOrPasswordIncorrectException();
		}

		return Auth.makeAuthToken(existingUser.id);
	}
}
