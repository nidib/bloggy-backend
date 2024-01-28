import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

import { UnauthorizedException } from 'src/exceptions/unauthorized-exception';
import { envs } from 'src/infra/config/envs';

const SALT_ROUNDS = 10;
const SEVEN_DAYS = '7d';

export class Auth {
	static async hashPassword(plaintextPassword: string): Promise<string> {
		return hash(plaintextPassword, SALT_ROUNDS);
	}

	static async validatePassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
		return compare(plaintextPassword, hashedPassword);
	}

	static makeAuthToken(userId: string): string {
		return sign({ userId }, envs.jwtKey, { expiresIn: SEVEN_DAYS });
	}

	static validateToken(token: string): { userId: string } {
		try {
			const payload = verify(token, envs.jwtKey) as { userId: string };

			return payload;
		} catch (_) {
			throw new UnauthorizedException();
		}
	}
}
