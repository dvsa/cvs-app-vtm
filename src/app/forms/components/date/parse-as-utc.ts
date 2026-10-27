const HAS_TIME_WITHOUT_OFFSET = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

/**
 * Parses an ISO date string, treating a date-time with no offset as UTC.
 * Older records were saved without a trailing `Z`, which the browser would otherwise read as local time.
 */
export function parseAsUtc(value: string): Date {
	return new Date(HAS_TIME_WITHOUT_OFFSET.test(value) ? `${value}Z` : value);
}
