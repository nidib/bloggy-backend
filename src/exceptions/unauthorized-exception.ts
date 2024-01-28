import { ApiException } from 'src/exceptions/api-exception';

export class UnauthorizedException extends ApiException {
	constructor() {
		super(`Não autorizado`, 401);
	}
}
