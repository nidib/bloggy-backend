import { ApiException } from 'src/exceptions/api-exception';

export class ArticleNotFoundException extends ApiException {
	constructor() {
		super(`Article not found`, 404);
	}
}
