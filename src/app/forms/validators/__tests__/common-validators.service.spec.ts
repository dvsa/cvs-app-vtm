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
			expect(result).toEqual({ max: 'message' });
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
			expect(result).toEqual({ min: 'message' });
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
			expect(result).toEqual({ maxLength: 'message' });
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
			expect(result).toEqual({ pattern: 'message' });
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
			expect(result).toEqual({ pastDate: 'message' });
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
			expect(result).toEqual({ invalidDate: 'message' });
		});
	});
});
