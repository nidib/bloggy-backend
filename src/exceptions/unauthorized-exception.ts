import { ApiException } from 'src/exceptions/api-exception';

export class UnauthorizedException extends ApiException {
	constructor() {
		super(`Not authorized`, 401);
	}
}
