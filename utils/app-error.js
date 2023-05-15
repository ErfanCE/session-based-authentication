class AppError extends Error {
	constructor(statusCode, errorMessage) {
		super(errorMessage);

		this.statusCode = statusCode;
		this.status = statusCode.toString().startsWith('5') ? 'error' : 'fail';

		Error.captureStackTrace(this);
	}
}

module.exports = { AppError };
