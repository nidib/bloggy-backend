import { ApiException } from 'src/exceptions/api-exception';

export class UserOrPasswordIncorrectException extends ApiException {
	constructor() {
		super('Usuário ou senha incorretos', 401);
	}
}
