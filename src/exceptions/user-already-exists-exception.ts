import { ApiException } from 'src/exceptions/api-exception';

export class UserAlreadyExistsException extends ApiException {
	constructor(username: string) {
		super(`Usuário "${username}" já existente`, 409);
	}
}
