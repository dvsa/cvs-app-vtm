import { parseAsUtc } from '../parse-as-utc';

describe('parseAsUtc', () => {
	it.each([
		['a date-time with no offset as UTC', '2025-07-09T00:00:00.000', '2025-07-09T00:00:00.000Z'],
		['a date-time with no milliseconds as UTC', '2025-07-09T10:15:30', '2025-07-09T10:15:30.000Z'],
		['a date-time with no seconds as UTC', '2025-07-09T10:15', '2025-07-09T10:15:00.000Z'],
		['a UTC date-time unchanged', '2025-07-09T00:00:00.000Z', '2025-07-09T00:00:00.000Z'],
		['a date-time with an offset unchanged', '2025-07-09T01:00:00.000+01:00', '2025-07-09T00:00:00.000Z'],
		['a date only value as UTC', '2025-07-09', '2025-07-09T00:00:00.000Z'],
	])('should parse %s', (_, value, expected) => {
		expect(parseAsUtc(value).toISOString()).toBe(expected);
	});
});
