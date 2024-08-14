import { TruncatePipe } from './truncate.pipe';

describe('truncatePipe pipe tests', () => {
	// This pipe is a pure, stateless function so no need for BeforeEach
	const pipe = new TruncatePipe();

	it('does not truncate string', () => {
		expect(pipe.transform('too short', 10, '...')).toBe('too short');
	});

	it('transforms "this string is too long" to "this string is too..."', () => {
		expect(pipe.transform('this string is too long', 11)).toBe('this string...');
	});

	it('transforms "this string is too long" to "this string is too:::"', () => {
		expect(pipe.transform('this string is too long', 11, ':::')).toBe('this string:::');
	});
});
