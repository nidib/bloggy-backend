import { UserRepository } from 'src/domains/user/repositories/user-repository';
import { UnauthorizedException } from 'src/exceptions/unauthorized-exception';
import { Auth } from 'src/infra/auth/auth';

export class AuthenticationService {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(bearer?: string): Promise<string> {
		if (!bearer) {
			throw new UnauthorizedException();
		}

		const [, token] = bearer.split('Bearer ');

		if (!token) {
			throw new UnauthorizedException();
		}

		const { userId } = await Auth.validateToken(token);
		const existingUser = await this.userRepository.getOneById(userId);

		if (!existingUser) {
			throw new UnauthorizedException();
		}

		return existingUser.id;
	}
}
