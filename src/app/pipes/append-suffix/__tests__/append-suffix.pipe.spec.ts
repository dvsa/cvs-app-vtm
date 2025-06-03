import { AppendSuffixPipe } from '@pipes/append-suffix/append-suffix.pipe';

describe('AppendSuffixPipe', () => {
	let pipe: AppendSuffixPipe;

	beforeEach(() => {
		pipe = new AppendSuffixPipe();
	});

	it('should append the suffix to a valid number', () => {
		expect(pipe.transform(123, 'kg')).toBe('123 kg');
	});

	it('should append the suffix to a valid string number', () => {
		expect(pipe.transform('456', 'm')).toBe('456 m');
	});

	it('should return "-" for invalid numbers', () => {
		expect(pipe.transform('abc', 'kg')).toBe('-');
		expect(pipe.transform(null, 'kg')).toBe('-');
		expect(pipe.transform(undefined, 'kg')).toBe('-');
	});

	it('should handle zero correctly', () => {
		expect(pipe.transform(0, 'kg')).toBe('0 kg');
		expect(pipe.transform('0', 'kg')).toBe('0 kg');
	});
});
