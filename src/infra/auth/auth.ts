import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { envs } from 'src/infra/config/envs';

const SALT_ROUNDS = 10;
const SEVEN_DAYS = 60 * 60 + 24 * 7;

export class Auth {
	static async hashPassword(plaintextPassword: string): Promise<string> {
		return hash(plaintextPassword, SALT_ROUNDS);
	}

	static async validatePassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
		return compare(plaintextPassword, hashedPassword);
	}

	static async makeAuthToken(userId: string): Promise<string> {
		return sign({ userId }, envs.jwtKey, { expiresIn: SEVEN_DAYS });
	}
}
