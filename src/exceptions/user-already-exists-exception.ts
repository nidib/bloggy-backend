import { ApiException } from 'src/exceptions/api-exception';

export class UserAlreadyExistsException extends ApiException {
	constructor(username: string) {
		super(`Username "${username}" already exists`, 500);
	}
}
