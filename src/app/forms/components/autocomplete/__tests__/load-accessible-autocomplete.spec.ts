import { loadAccessibleAutocomplete } from '../load-accessible-autocomplete';

const enhanceSelectElement = jest.fn();

// mirror the browser build, where the lazily loaded chunk of this CommonJS package only exports `default`
jest.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => ({
	__esModule: true,
	default: { enhanceSelectElement },
}));

describe('loadAccessibleAutocomplete', () => {
	it('should expose enhanceSelectElement when the module only has a default export', async () => {
		const library = await loadAccessibleAutocomplete();

		expect(library.enhanceSelectElement).toBe(enhanceSelectElement);
	});
});
