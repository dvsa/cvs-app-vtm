import { DefaultNullOrEmpty } from '../default-null-or-empty.pipe';

describe('DefaultNullOrEmpty pipe tests', () => {
	// This pipe is a pure, stateless function so no need for BeforeEach
	const pipe = new DefaultNullOrEmpty();

	describe('transforming value when no suffix is provided', () => {
		it('transforms null to "-"', () => {
			expect(pipe.transform(null)).toBe('-');
		});

		it('transforms "" to "-"', () => {
			expect(pipe.transform('')).toBe('-');
		});

		it('transforms "     " to "-"', () => {
			expect(pipe.transform('     ')).toBe('-');
		});

		it('transforms boolean "true" to "Yes"', () => {
			expect(pipe.transform(true)).toBe('Yes');
		});

		it('transforms boolean "false" to "No"', () => {
			expect(pipe.transform(false)).toBe('No');
		});

		it('otherwise returns the string value unchanged', () => {
			expect(pipe.transform('This is OK')).toBe('This is OK');
		});

		it('otherwise returns the date value unchanged', () => {
			const val = new Date();
			expect(pipe.transform(val)).toBe(val);
		});

		it('should capitalise the first character of a string', () => {
			const val = 'lowercase string';
			expect(pipe.transform(val)).toBe('Lowercase string');
		});
	});

	describe('transforming value when a suffix is provided', () => {
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
});
