export function validationErrorMessage(error: unknown): string {
	if (typeof error === 'string') return error;
	if (typeof error === 'object' && error !== null) {
		if ('error' in error && typeof error.error === 'string') return error.error;
		if ('message' in error && typeof error.message === 'string') return error.message;
	}
	throw new Error('Validation error does not contain a message');
}
