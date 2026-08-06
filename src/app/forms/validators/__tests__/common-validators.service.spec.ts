import { State, initialAppState } from '@/src/app/store';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonValidatorsService } from '../common-validators.service';

describe('CommonValidatorsService', () => {
	let service: CommonValidatorsService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [CommonValidatorsService, provideMockStore<State>({ initialState: initialAppState })],
		}).compileComponents();

		service = TestBed.inject(CommonValidatorsService);

		jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
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
	});
});
