import { MultiOptions } from '@/src/app/models/options.model';
import { MultiOptionPipe } from '../multi-option.pipe';

describe('MultiOption pipe tests', () => {
	const pipe = new MultiOptionPipe();

	const options: MultiOptions = [
		{ label: 'Option 1', value: '1' },
		{ label: 'Option 2', value: '2' },
		{ label: 'option 3', value: '3' },
	];

	it('should the label associated with the value in the multi option list', () => {
		expect(pipe.transform('1', options)).toBe('Option 1');
		expect(pipe.transform('2', options)).toBe('Option 2');
	});

	it('should capitalise the first letter of the label', () => {
		expect(pipe.transform('3', options)).toBe('Option 3');
	});

	it('should return a dash if the value is not present in the multi option list', () => {
		expect(pipe.transform('4', options)).toBe('-');
	});
});
