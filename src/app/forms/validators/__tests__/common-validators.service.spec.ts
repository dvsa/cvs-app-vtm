import { State, initialAppState } from '@/src/app/store';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonValidatorsService } from '../common-validators.service';

describe('CommonValidatorsService', () => {
	let service: CommonValidatorsService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [CommonValidatorsService, provideMockStore<State>({ initialState: initialAppState })],
		}).compileComponents();

		service = TestBed.inject(CommonValidatorsService);

		vi.useFakeTimers().setSystemTime(new Date('2024-01-01'));
	});

	describe('max', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.max(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value equal to max', () => {
			const control = new FormControl(10);
			const result = service.max(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value less than the max', () => {
			const control = new FormControl(5);
			const result = service.max(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value greater than the max', () => {
			const control = new FormControl(15);
			const result = service.max(10, 'message')(control);
			expect(result).toEqual({
				max: { error: 'message must be less than or equal to 10', anchorLink: '', accordion: '' },
			});
		});
	});

	describe('min', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.min(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value equal to min', () => {
			const control = new FormControl(10);
			const result = service.min(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value greater than the min', () => {
			const control = new FormControl(15);
			const result = service.min(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value less than the min', () => {
			const control = new FormControl(5);
			const result = service.min(10, 'message')(control);
			expect(result).toEqual({
				min: { error: 'message must be greater than or equal to 10', anchorLink: '', accordion: '' },
			});
		});
	});

	describe('maxLength', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.maxLength(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value equal to max length', () => {
			const control = new FormControl('1234567890');
			const result = service.maxLength(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value less than the max length', () => {
			const control = new FormControl('123456');
			const result = service.maxLength(10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value greater than the max length', () => {
			const control = new FormControl('12345678901');
			const result = service.maxLength(10, 'message')(control);
			expect(result).toEqual({
				maxLength: { error: 'message must be less than or equal to 10 characters', anchorLink: '', accordion: '' },
			});
		});
	});

	describe('pattern', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.pattern('^[a-zA-Z]+$', 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value that matches the pattern', () => {
			const control = new FormControl('abc');
			const result = service.pattern('^[a-zA-Z]+$', 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value that does not match the pattern', () => {
			const control = new FormControl('123');
			const result = service.pattern('^[a-zA-Z]+$', 'message')(control);
			expect(result).toEqual({ pattern: { error: 'message', anchorLink: '', accordion: '' } });
		});

		it('should populate accordion and anchorLink when provided', () => {
			const control = new FormControl('123');
			const result = service.pattern('^[a-zA-Z]+$', 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				pattern: { error: 'message', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl('123');
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.pattern('^[a-zA-Z]+$', func)(control);
			expect(func).toHaveBeenCalledWith(control);
			expect(result).toEqual({ pattern: { error: 'custom' } });
		});
	});

	describe('pastDate', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.pastDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value that is a past date', () => {
			const control = new FormControl('2021-01-01'); // current date mocked as 2024-01-01
			const result = service.pastDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value that is a future date', () => {
			const control = new FormControl('2025-01-01'); // current date mocked as 2024-01-01
			const result = service.pastDate('message')(control);
			expect(result).toEqual({ pastDate: { error: 'message must be in the past', anchorLink: '', accordion: '' } });
		});

		it('should populate accordion and anchorLink when provided', () => {
			const control = new FormControl('2025-01-01');
			const result = service.pastDate('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				pastDate: { error: 'message must be in the past', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});
	});

	describe('futureDate', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.futureDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value that is a future date', () => {
			const control = new FormControl('2025-01-01'); // current date mocked as 2024-01-01
			const result = service.futureDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value that is a past date', () => {
			const control = new FormControl('2023-01-01'); // current date mocked as 2024-01-01
			const result = service.futureDate('message')(control);
			expect(result).toEqual({ futureDate: { error: 'message must be in the future', anchorLink: '', accordion: '' } });
		});

		it('should return null for dates with a non-four-digit year (skip validation)', () => {
			const control = new FormControl('123-01-01');
			const result = service.futureDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null for invalid date strings', () => {
			const control = new FormControl('abc');
			const result = service.futureDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null when any date part is the string "null" or "undefined"', () => {
			const control1 = new FormControl('2025-null-01');
			const control2 = new FormControl('2025-01-undefined');
			expect(service.futureDate('message')(control1)).toBeNull();
			expect(service.futureDate('message')(control2)).toBeNull();
		});

		it('should return null for datetime strings missing time parts (skip validation)', () => {
			const control = new FormControl('2025-01-01T12'); // missing minute/seconds
			const result = service.futureDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the parsed date is invalid despite passing basic part checks', () => {
			const control = new FormControl('2025-ab-01');
			const result = service.futureDate('message')(control);
			expect(result).toBeNull();
		});

		it('should populate accordion and anchorLink when provided', () => {
			const control = new FormControl('2023-01-01');
			const result = service.futureDate('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				futureDate: { error: 'message must be in the future', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});
	});

	describe('invalidDate', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.invalidDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has a value that is a valid date', () => {
			const control = new FormControl('2021-01-01');
			const result = service.invalidDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error object if the control has a value that is not a valid date', () => {
			const control = new FormControl('abc');
			const result = service.invalidDate('message')(control);
			expect(result).toEqual({ invalidDate: { error: 'message', anchorLink: '', accordion: '' } });
		});

		it('should populate accordion and anchorLink when provided', () => {
			const control = new FormControl('abc');
			const result = service.invalidDate('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({ invalidDate: { error: 'message', anchorLink: 'myAnchor', accordion: 'myAccordion' } });
		});
	});

	describe('datetime', () => {
		it('should return null if the control has a value of null', () => {
			const control = new FormControl(null);
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toBeNull();
		});

		it('should return minutes error if minutes is greater than 59', () => {
			const control = new FormControl('2021-01-01T00:60:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' minutes must be between 0 and 59",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return hours error if hours is greater than 23', () => {
			const control = new FormControl('2021-01-01T24:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' hours must be between 0 and 23",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return time error if time is not included', () => {
			const control = new FormControl('2021-01-01');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' must include time",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return year error if year is not four digits', () => {
			const control = new FormControl('999-01-01T00:00:00.000');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' year must be four digits",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return must include a day error if day is not included', () => {
			const control = new FormControl('2021-01T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' must include a day",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return must include a month error if month is not included', () => {
			const control = new FormControl('2021--01T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' must include a month",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return must include a year error if year is not included', () => {
			const control = new FormControl('-01-01T00:00:00.000');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' must include a year",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return day must be between 1 and 28 in the month of February error if day is greater than 28, and the year is not a leap year', () => {
			const control = new FormControl('2021-02-29T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' day must be between 1 and 28 in the month of February",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return day must be between 1 and 29 in the month of February error if day is greater than 29, and the year is a leap year', () => {
			const control = new FormControl('2004-02-30T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' day must be between 1 and 29 in the month of February",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return day must be between 1 and 31 in the month of March error if day is greater than 31, and the year is not a leap year', () => {
			const control = new FormControl('2021-03-32T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' day must be between 1 and 31 in the month of March",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return day must be between 1 and 30 in the month of April error if day is greater than 30, and the year is a leap year', () => {
			const control = new FormControl('2004-04-31T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' day must be between 1 and 30 in the month of April",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return month must be between 1 and 12 error if month is greater than 12', () => {
			const control = new FormControl('2021-13-01T00:00:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' month must be between 1 and 12",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return time error if the time parts are not numeric', () => {
			const control = new FormControl('2021-01-01Tab:cd');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toEqual({
				datetime: {
					error: "'Test start date and time' must include time",
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should return null for a fully valid datetime', () => {
			const control = new FormControl('2021-01-01T12:30:00.000Z');
			const result = service.datetime({ label: 'Test start date and time' })(control);
			expect(result).toBeNull();
		});
	});

	describe('isOneOf', () => {
		enum TestEnum {
			A = 'a',
			B = 'b',
		}

		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.isOneOf(TestEnum, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value is one of the enum values', () => {
			const control = new FormControl('a');
			const result = service.isOneOf(TestEnum, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is not one of the enum values', () => {
			const control = new FormControl('c');
			const result = service.isOneOf(TestEnum, 'message')(control);
			expect(result).toEqual({ oneOf: { error: 'message', anchorLink: '', accordion: '' } });
		});

		it('should populate accordion and anchorLink when provided', () => {
			const control = new FormControl('c');
			const result = service.isOneOf(TestEnum, 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({ oneOf: { error: 'message', anchorLink: 'myAnchor', accordion: 'myAccordion' } });
		});
	});

	describe('max (function message)', () => {
		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl(15);
			const func = vi.fn(() => ({ error: 'custom', anchorLink: 'a', accordion: 'b' }));
			const result = service.max(10, func)(control);
			expect(func).toHaveBeenCalledWith(control);
			expect(result).toEqual({ max: { error: 'custom', anchorLink: 'a', accordion: 'b' } });
		});

		it('should populate accordion and anchorLink for string message', () => {
			const control = new FormControl(15);
			const result = service.max(10, 'message', 'kg', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				max: { error: 'message must be less than or equal to 10kg', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});
	});

	describe('min (function message)', () => {
		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl(5);
			const func = vi.fn(() => ({ error: 'custom', anchorLink: 'a', accordion: 'b' }));
			const result = service.min(10, func)(control);
			expect(func).toHaveBeenCalledWith(control);
			expect(result).toEqual({ min: { error: 'custom', anchorLink: 'a', accordion: 'b' } });
		});

		it('should populate accordion and anchorLink for string message', () => {
			const control = new FormControl(5);
			const result = service.min(10, 'message', 'kg', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				min: {
					error: 'message must be greater than or equal to 10kg',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});

		it('should return null when value is null', () => {
			const control = new FormControl(null);
			const result = service.min(10, 'message')(control);
			expect(result).toBeNull();
		});
	});

	describe('exactLengthDigits', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.exactLengthDigits(4, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the value is exactly the given length', () => {
			const control = new FormControl('1234');
			const result = service.exactLengthDigits(4, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the value is shorter than the given length', () => {
			const control = new FormControl('123');
			const result = service.exactLengthDigits(4, 'message')(control);
			expect(result).toEqual({ minLength: { error: 'message must be 4 digits', anchorLink: '', accordion: '' } });
		});

		it('should return an error if the value is longer than the given length', () => {
			const control = new FormControl('12345');
			const result = service.exactLengthDigits(4, 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				minLength: { error: 'message must be 4 digits', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl('123');
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.exactLengthDigits(4, func)(control);
			expect(func).toHaveBeenCalledWith(control);
			expect(result).toEqual({ minLength: { error: 'custom' } });
		});
	});

	describe('minLength', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.minLength(4, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the value is equal to minLength', () => {
			const control = new FormControl('1234');
			const result = service.minLength(4, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the value is shorter than minLength', () => {
			const control = new FormControl('12');
			const result = service.minLength(4, 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				minLength: {
					error: 'message must be greater than or equal to 4 characters',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			const control = new FormControl('12');
			const result = service.minLength(4, 'message')(control);
			expect(result).toEqual({
				minLength: {
					error: 'message must be greater than or equal to 4 characters',
					anchorLink: '',
					accordion: '',
				},
			});
		});

		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl('12');
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.minLength(4, func)(control);
			expect(result).toEqual({ minLength: { error: 'custom' } });
		});
	});

	describe('maxLength (function message)', () => {
		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl('12345678901');
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.maxLength(10, func)(control);
			expect(result).toEqual({ maxLength: { error: 'custom' } });
		});

		it('should populate accordion and anchorLink', () => {
			const control = new FormControl('12345678901');
			const result = service.maxLength(10, 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				maxLength: {
					error: 'message must be less than or equal to 10 characters',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});
	});

	describe('range', () => {
		it('should return null if the control value is falsy and not 0', () => {
			const control = new FormControl(null);
			control.markAsTouched();
			const result = service.range(1, 10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has not been touched', () => {
			const control = new FormControl(20);
			const result = service.range(1, 10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value is not a number', () => {
			const control = new FormControl('abc');
			control.markAsTouched();
			const result = service.range(1, 10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value is within range', () => {
			const control = new FormControl(5);
			control.markAsTouched();
			const result = service.range(1, 10, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is out of range', () => {
			const control = new FormControl(20);
			control.markAsTouched();
			const result = service.range(1, 10, 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				range: { error: 'message must be between 1 and 10', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error if the control value of 0 is within range', () => {
			const control = new FormControl(0);
			control.markAsTouched();
			const result = service.range(1, 10, 'message')(control);
			expect(result).toEqual({ range: { error: 'message must be between 1 and 10', anchorLink: '', accordion: '' } });
		});

		it('should call the function and return its result when message is a function', () => {
			const control = new FormControl(20);
			control.markAsTouched();
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.range(1, 10, func)(control);
			expect(result).toEqual({ range: { error: 'custom' } });
		});
	});

	describe('antipattern', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.antipattern('^[0-9]+$', 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value does not match the pattern', () => {
			const control = new FormControl('abc');
			const result = service.antipattern('^[0-9]+$', 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the control value matches the pattern', () => {
			const control = new FormControl('123');
			const result = service.antipattern('^[0-9]+$', 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				pattern: { error: 'message', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			const control = new FormControl('123');
			const result = service.antipattern('^[0-9]+$', 'message')(control);
			expect(result).toEqual({
				pattern: { error: 'message', anchorLink: '', accordion: '' },
			});
		});
	});

	describe('alphanumeric', () => {
		it('should return null for alphanumeric values', () => {
			const control = new FormControl('abc123');
			const result = service.alphanumeric('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error for non-alphanumeric values', () => {
			const control = new FormControl('abc-123');
			const result = service.alphanumeric('message')(control);
			expect(result).toEqual({ pattern: { error: 'message', anchorLink: '', accordion: '' } });
		});
	});

	describe('pastOrCurrentDate', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.pastOrCurrentDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null for today', () => {
			const control = new FormControl('2024-01-01'); // current date mocked as 2024-01-01
			const result = service.pastOrCurrentDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return null for a past date', () => {
			const control = new FormControl('2023-01-01');
			const result = service.pastOrCurrentDate('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error for a future date', () => {
			const control = new FormControl('2025-01-01');
			const result = service.pastOrCurrentDate('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				pastOrCurrentDate: {
					error: 'message must be today or in the past',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});
	});

	describe('pastOrCurrentYear', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.pastOrCurrentYear('message')(control);
			expect(result).toBeNull();
		});

		it('should return null for the current year', () => {
			const control = new FormControl(2024);
			const result = service.pastOrCurrentYear('message')(control);
			expect(result).toBeNull();
		});

		it('should return null for a past year', () => {
			const control = new FormControl(2020);
			const result = service.pastOrCurrentYear('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error for a future year', () => {
			const control = new FormControl(2030);
			const result = service.pastOrCurrentYear('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				pastOrCurrentYear: {
					error: 'message must be the current or a past year',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			const control = new FormControl(2030);
			const result = service.pastOrCurrentYear('message')(control);
			expect(result).toEqual({
				pastOrCurrentYear: {
					error: 'message must be the current or a past year',
					anchorLink: '',
					accordion: '',
				},
			});
		});
	});

	describe('pastYear', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.pastYear('message')(control);
			expect(result).toBeNull();
		});

		it('should return null for a past year', () => {
			const control = new FormControl(2020);
			const result = service.pastYear('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error for a future year', () => {
			const control = new FormControl(2030);
			const result = service.pastYear('message')(control);
			expect(result).toEqual({ pastYear: 'message' });
		});

		it('should execute accordion/anchorLink branches without affecting the returned error', () => {
			const control = new FormControl(2030);
			const result = service.pastYear('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({ pastYear: 'message' });
		});
	});

	describe('_date', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service._date('Test date')(control);
			expect(result).toBeNull();
		});

		it('should return null for a valid date', () => {
			const control = new FormControl('2021-01-01');
			const result = service._date('Test date')(control);
			expect(result).toBeNull();
		});

		it('should return an error for an invalid year', () => {
			const control = new FormControl('abcd-01-01');
			const result = service._date('Test date')(control);
			expect(result).toEqual({ date: expect.any(String) });
		});

		it('should return an error for an invalid month', () => {
			const control = new FormControl('2021-13-01');
			const result = service._date('Test date')(control);
			expect(result).toEqual({ date: expect.any(String) });
		});

		it('should return an error for an invalid day', () => {
			const control = new FormControl('2021-01-32');
			const result = service._date('Test date')(control);
			expect(result).toEqual({ date: expect.any(String) });
		});

		it('should return the first sorted error when multiple parts are invalid', () => {
			const control = new FormControl('abcd-ab-32');
			const result = service._date('Test date')(control);
			expect(result).toEqual({ date: expect.any(String) });
		});
	});

	describe('date', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.date('Test date')(control);
			expect(result).toBeNull();
		});

		it('should return null for a valid date', () => {
			const control = new FormControl('2021-01-01');
			const result = service.date('Test date')(control);
			expect(result).toBeNull();
		});

		it('should return an error for an invalid date', () => {
			const control = new FormControl('2021-13-01');
			const result = service.date('Test date', 'myAnchor', 'myAccordion')(control);
			expect(result).toEqual({
				invalidDate: { error: expect.any(String), anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error without an anchorLink when no id is provided', () => {
			const control = new FormControl('2021-13-01');
			const result = service.date('Test date')(control);
			expect(result).toEqual({
				invalidDate: { error: expect.any(String), anchorLink: '', accordion: '' },
			});
		});

		it('should default the anchorLink to the label when id is a function returning a falsy value', () => {
			const control = new FormControl('2021-13-01');
			const idFn = vi.fn(() => '');
			const result = service.date('Test date', idFn)(control);
			expect(result).toEqual({
				invalidDate: { error: expect.any(String), anchorLink: 'Test date', accordion: '' },
			});
		});

		it('should handle a missing day part', () => {
			const control = new FormControl('2021-01');
			const result = service.date('Test date')(control);
			expect(result).toEqual({
				invalidDate: { error: expect.any(String), anchorLink: '', accordion: '' },
			});
		});

		it('should resolve anchorLink using a function when id is a function', () => {
			const control = new FormControl('2021-13-01');
			const idFn = vi.fn(() => 'resolvedAnchor');
			const result = service.date('Test date', idFn, 'myAccordion')(control);
			expect(idFn).toHaveBeenCalledWith(control);
			expect(result).toEqual({
				invalidDate: { error: expect.any(String), anchorLink: 'resolvedAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error if the year is not four digits', () => {
			const control = new FormControl('202-01-01');
			const result = service.date('Test date', 'myAnchor')(control);
			expect(result).toEqual({
				invalidDate: {
					error: "'Test date' year must be four digits",
					anchorLink: 'myAnchor',
					accordion: '',
				},
			});
		});

		it('should return an error if the year is not four digits with no id and with accordion', () => {
			const control = new FormControl('202-01-01');
			const result = service.date('Test date', undefined, 'myAccordion')(control);
			expect(result).toEqual({
				invalidDate: {
					error: "'Test date' year must be four digits",
					anchorLink: '',
					accordion: 'myAccordion',
				},
			});
		});
	});

	describe('requiredWith', () => {
		it('should return null if the control has no parent', () => {
			const control = new FormControl(null);
			const result = service.requiredWith('field1', 'field2')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value is a non-empty array', () => {
			const group = new FormGroup({ field: new FormControl(['item']) });
			const result = service.requiredWith('field1', 'field2')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is a truthy value', () => {
			const group = new FormGroup({ field: new FormControl('value') });
			const result = service.requiredWith('field1', 'field2')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is 0', () => {
			const group = new FormGroup({ field: new FormControl(0) });
			const result = service.requiredWith('field1', 'field2')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is missing', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.requiredWith(
				'field1',
				'field2',
				'myAccordion',
				'myAnchor'
			)(group.get('field') as FormControl);
			expect(result).toEqual({
				required: { error: 'field1 is required with field2', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.requiredWith('field1', 'field2')(group.get('field') as FormControl);
			expect(result).toEqual({
				required: { error: 'field1 is required with field2', anchorLink: '', accordion: '' },
			});
		});

		it('should call the function and return its result when message is a function', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.requiredWith(func, 'field2')(group.get('field') as FormControl);
			expect(result).toEqual({ required: { error: 'custom' } });
		});
	});

	describe('required', () => {
		it('should return null if the control has no parent', () => {
			const control = new FormControl(null);
			const result = service.required('message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value is a non-empty array', () => {
			const group = new FormGroup({ field: new FormControl(['item']) });
			const result = service.required('message')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is truthy', () => {
			const group = new FormGroup({ field: new FormControl('value') });
			const result = service.required('message')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is missing', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.required('message', 'myAccordion', 'myAnchor')(group.get('field') as FormControl);
			expect(result).toEqual({
				required: { error: 'message is required', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.required('message')(group.get('field') as FormControl);
			expect(result).toEqual({
				required: { error: 'message is required', anchorLink: '', accordion: '' },
			});
		});

		it('should call the function and return its result when message is a function', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.required(func)(group.get('field') as FormControl);
			expect(result).toEqual({ required: { error: 'custom' } });
		});
	});

	describe('requiredTrue', () => {
		it('should return null if the control has no parent', () => {
			const control = new FormControl(false);
			const result = service.requiredTrue('message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control value is not explicitly false', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.requiredTrue('message')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is true', () => {
			const group = new FormGroup({ field: new FormControl(true) });
			const result = service.requiredTrue('message')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is false', () => {
			const group = new FormGroup({ field: new FormControl(false) });
			const result = service.requiredTrue('message', 'myAccordion', 'myAnchor')(group.get('field') as FormControl);
			expect(result).toEqual({
				requiredTrue: { error: 'message', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			const group = new FormGroup({ field: new FormControl(false) });
			const result = service.requiredTrue('message')(group.get('field') as FormControl);
			expect(result).toEqual({
				requiredTrue: { error: 'message', anchorLink: '', accordion: '' },
			});
		});

		it('should call the function and return its result when message is a function', () => {
			const group = new FormGroup({ field: new FormControl(false) });
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.requiredTrue(func)(group.get('field') as FormControl);
			expect(result).toEqual({ requiredTrue: { error: 'custom' } });
		});
	});

	describe('xYearsAfterCurrent', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.xYearsAfterCurrent(5, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the year is within range', () => {
			const control = new FormControl(2026); // current year mocked as 2024
			const result = service.xYearsAfterCurrent(5, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the year is after the max', () => {
			const control = new FormControl(2030);
			const result = service.xYearsAfterCurrent(5, 'message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				xYearsAfterCurrent: {
					error: 'message must be equal to or before 2029',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});

		it('should return an error if the year is negative', () => {
			const control = new FormControl(-1);
			const result = service.xYearsAfterCurrent(5, 'message')(control);
			expect(result).toEqual({
				xYearsAfterCurrent: { error: 'message must be equal to or before 2029', anchorLink: '', accordion: '' },
			});
		});
	});

	describe('invalidOption', () => {
		it('should return null for a valid option', () => {
			const control = new FormControl('valid value');
			const result = service.invalidOption('message')(control);
			expect(result).toBeNull();
		});

		it('should return an error for the invalid option sentinel value', () => {
			const control = new FormControl('[INVALID_OPTION]');
			const result = service.invalidOption('message', 'myAccordion', 'myAnchor')(control);
			expect(result).toEqual({
				invalidOption: { error: 'message', accordion: 'myAccordion', anchorLink: 'myAnchor' },
			});
		});
	});

	describe('doesTyresRefDataExist', () => {
		it('should return null if the control has no value', () => {
			const control = new FormControl(null);
			const result = service.doesTyresRefDataExist(ReferenceDataResourceType.Tyres, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return null if the reference data is found', () => {
			vi.spyOn(service.store, 'selectSignal').mockReturnValue(() => [{ code: '123' }]);
			const control = new FormControl('123');
			const result = service.doesTyresRefDataExist(ReferenceDataResourceType.Tyres, 'message')(control);
			expect(result).toBeNull();
		});

		it('should return an error if the reference data is not found', () => {
			vi.spyOn(service.store, 'selectSignal').mockReturnValue(() => []);
			const control = new FormControl('123');
			const result = service.doesTyresRefDataExist(
				ReferenceDataResourceType.Tyres,
				'message',
				'myAccordion',
				'myAnchor'
			)(control);
			expect(result).toEqual({
				noAxleData: { error: 'message', anchorLink: 'myAnchor', accordion: 'myAccordion' },
			});
		});

		it('should return an error without accordion/anchorLink when not provided', () => {
			vi.spyOn(service.store, 'selectSignal').mockReturnValue(() => []);
			const control = new FormControl('123');
			const result = service.doesTyresRefDataExist(ReferenceDataResourceType.Tyres, 'message')(control);
			expect(result).toEqual({
				noAxleData: { error: 'message', anchorLink: '', accordion: '' },
			});
		});

		it('should call the function and return its result when message is a function', () => {
			vi.spyOn(service.store, 'selectSignal').mockReturnValue(() => []);
			const control = new FormControl('123');
			const func = vi.fn(() => ({ error: 'custom' }));
			const result = service.doesTyresRefDataExist(ReferenceDataResourceType.Tyres, func)(control);
			expect(result).toEqual({ noAxleData: { error: 'custom' } });
		});
	});

	describe('applyWhen', () => {
		it('should return null if the control has no parent', () => {
			const control = new FormControl(null);
			const result = service.applyWhen(() => true, service.required('message'))(control);
			expect(result).toBeNull();
		});

		it('should return null if the condition is false', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.applyWhen(() => false, service.required('message'))(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should run the validators and return errors if the condition is true', () => {
			const group = new FormGroup({ field: new FormControl(null) });
			const result = service.applyWhen(() => true, service.required('message'))(group.get('field') as FormControl);
			expect(result).toEqual({
				required: { error: 'message is required', anchorLink: '', accordion: '' },
			});
		});
	});

	describe('isAfterDate', () => {
		it('should return null if the control has no parent', () => {
			const control = new FormControl('2024-01-02');
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has no value', () => {
			const group = new FormGroup({ field: new FormControl(null), sibling: new FormControl('2024-01-01') });
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is not a valid date', () => {
			const group = new FormGroup({ field: new FormControl('abc'), sibling: new FormControl('2024-01-01') });
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the sibling control has no value', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-02'), sibling: new FormControl(null) });
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the sibling control is invalid', () => {
			const group = new FormGroup({
				field: new FormControl('2024-01-02'),
				sibling: new FormControl('2024-01-01', { validators: () => ({ invalid: true }) }),
			});
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the sibling value is not a valid date', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-02'), sibling: new FormControl('abc') });
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the dates are the same', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-01'), sibling: new FormControl('2024-01-01') });
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is after the sibling value', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-02'), sibling: new FormControl('2024-01-01') });
			const result = service.isAfterDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is before the sibling value', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-01'), sibling: new FormControl('2024-01-02') });
			const result = service.isAfterDate(
				'sibling',
				'label',
				'siblingLabel',
				'myAccordion',
				'myAnchor'
			)(group.get('field') as FormControl);
			expect(result).toEqual({
				aheadOfDate: {
					error: 'label must be ahead of siblingLabel (02/01/2024)',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});
	});

	describe('isBeforeDate', () => {
		it('should return null if the control has no parent', () => {
			const control = new FormControl('2024-01-01');
			const result = service.isBeforeDate('sibling', 'label', 'siblingLabel')(control);
			expect(result).toBeNull();
		});

		it('should return null if the control has no value', () => {
			const group = new FormGroup({ field: new FormControl(null), sibling: new FormControl('2024-01-02') });
			const result = service.isBeforeDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the sibling control has no value', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-01'), sibling: new FormControl(null) });
			const result = service.isBeforeDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the dates are the same', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-01'), sibling: new FormControl('2024-01-01') });
			const result = service.isBeforeDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return null if the control value is before the sibling value', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-01'), sibling: new FormControl('2024-01-02') });
			const result = service.isBeforeDate('sibling', 'label', 'siblingLabel')(group.get('field') as FormControl);
			expect(result).toBeNull();
		});

		it('should return an error if the control value is after the sibling value', () => {
			const group = new FormGroup({ field: new FormControl('2024-01-02'), sibling: new FormControl('2024-01-01') });
			const result = service.isBeforeDate(
				'sibling',
				'label',
				'siblingLabel',
				'myAccordion',
				'myAnchor'
			)(group.get('field') as FormControl);
			expect(result).toEqual({
				beforeDate: {
					error: 'label must be before siblingLabel (01/01/2024)',
					anchorLink: 'myAnchor',
					accordion: 'myAccordion',
				},
			});
		});
	});
});
