import validateDate from 'validate-govuk-date';

export function dateError(value: string, label: string): string | undefined {
	const [date] = value.split('T');
	const [year, month, day] = date.split('-');
	const { error, errors } = validateDate(day || '', month || '', year || '', label);
	if (error && errors?.length) return errors[0].reason;
	if (year.length !== 4) return `'${label}' year must be four digits`;
	return undefined;
}

export function dateTimeError(value: string, label: string): string | undefined {
	const [date, time] = value.split('T');
	const [year, month, day] = date.split('-');
	const { errors } = validateDate(day || '', month || '', year || '', label);

	if (errors?.length) return errors[0].reason;
	if (year.length !== 4) return `'${label}' year must be four digits`;
	if (!time) return `'${label}' must include time`;

	const [hh, mm] = time.split(':');
	const hours = Number.parseInt(hh, 10);
	const minutes = Number.parseInt(mm, 10);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return `'${label}' must include time`;
	if (hours > 23) return `'${label}' hours must be between 0 and 23`;
	if (minutes > 59) return `'${label}' minutes must be between 0 and 59`;
	return undefined;
}
