import { FormControl } from '@angular/forms';
import { DateValidators } from './date.validators';

describe('validDate', () => {
	it.each([
		[
			{
				invalidDate: {
					error: true,
					index: 0,
					reason: "'Date' day must be between 1 and 31 in the month of January",
				},
			},
			'2000-01-00',
		],
		[
			{
				invalidDate: {
					error: true,
					index: 1,
					reason: "'Date' month must be between 1 and 12",
				},
			},
			'2000-00-01',
		],
		[
			{
				invalidDate: {
					error: true,
					index: 0,
					reason: "'Date' must include a day",
				},
			},
			'20-01-',
		],
		[
			{
				invalidDate: {
					error: true,
					index: 1,
					reason: "'Date' must include a month",
				},
			},
			'20--01',
		],
		[
			{
				invalidDate: {
					error: true,
					index: 2,
					reason: "'Date' must include a year",
				},
			},
			'-01-00',
		],
		[
			{
				invalidDate: {
					error: true,
					reason: "'Date' year must be four digits",
				},
			},
			'20-01-01',
		],
		[{ invalidDate: { error: true, reason: "'Date' must include time" } }, '2022-01-01T:00:00:000Z', true],
		[
			{ invalidDate: { error: true, reason: "'Date' hours must be between 0 and 23" } },
			'2022-01-01T24:00:00:000Z',
			true,
		],
		[{ invalidDate: { error: true, reason: "'Date' must include time" } }, '2022-01-01T00::00:000Z', true],
		[
			{ invalidDate: { error: true, reason: "'Date' minutes must be between 0 and 59" } },
			'2022-01-01T00:60:00:000Z',
			true,
		],
		[null, ''],
		[null, '2022-01-01T00:00:00.000Z'],
	])('should validate date and return %s for %p', (expected, date: string, displayTime = false) => {
		const control = new FormControl(date);

		expect(DateValidators.validDate(displayTime)(control)).toEqual(expected);
	});
});
