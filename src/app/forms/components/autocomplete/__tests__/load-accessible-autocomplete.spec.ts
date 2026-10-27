import { vi } from 'vitest';
import { loadAccessibleAutocomplete } from '../load-accessible-autocomplete';

const { enhanceSelectElement } = vi.hoisted(() => ({ enhanceSelectElement: vi.fn() }));

// mirror the browser build, where the lazily loaded chunk of this CommonJS package only exports `default`
vi.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => ({
	__esModule: true,
	enhanceSelectElement: undefined,
	default: { enhanceSelectElement },
}));

describe('loadAccessibleAutocomplete', () => {
	it('should expose enhanceSelectElement when the module only has a default export', async () => {
		const library = await loadAccessibleAutocomplete();

		expect(library.enhanceSelectElement).toBe(enhanceSelectElement);
	});
});
