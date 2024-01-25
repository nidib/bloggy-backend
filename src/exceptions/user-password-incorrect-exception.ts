import { ApiException } from 'src/exceptions/api-exception';

export class UserOrPasswordIncorrectException extends ApiException {
	constructor() {
		super('Incorrect username or password', 401);
	}
}
