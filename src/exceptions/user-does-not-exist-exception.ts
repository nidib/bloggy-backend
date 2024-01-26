import { ApiException } from 'src/exceptions/api-exception';

export class UserDoesNotExistException extends ApiException {
	constructor() {
		super('Usuário não encontrado', 404);
	}
}
