import { ApiException } from 'src/exceptions/api-exception';

export class ArticleNotFoundException extends ApiException {
	constructor() {
		super(`Artigo não encontrado`, 404);
	}
}
