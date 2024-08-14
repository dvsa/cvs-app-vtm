declare module 'govuk-frontend/govuk/all' {
	export function initAll(): void;
}

declare module 'validate-govuk-date' {
	export default function validateDate(
		day: string | number,
		month: string | number,
		year: string | number,
		fieldName?: string
	): { error: boolean; date?: Date; errors?: [{ error: boolean; reason: string; index: number }] };
}
