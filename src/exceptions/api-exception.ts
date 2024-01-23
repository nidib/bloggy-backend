export class ApiException extends Error {
	public code: number;

	constructor(message: string, code = 500) {
		super(message);

		this.code = code;
	}
}
