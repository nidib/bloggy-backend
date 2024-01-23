import { ApiException } from 'src/exceptions/api-exception';

export class RouteNotFoundException extends ApiException {
	constructor() {
		super('Rota não encontrada', 404);
	}
}
