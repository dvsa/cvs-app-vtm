import { InjectionToken } from '@angular/core';

type AccessibleAutocomplete = typeof import('accessible-autocomplete/dist/accessible-autocomplete.min');
export type AccessibleAutocompleteLoader = () => Promise<Pick<AccessibleAutocomplete, 'enhanceSelectElement'>>;

export const ACCESSIBLE_AUTOCOMPLETE_LOADER = new InjectionToken<AccessibleAutocompleteLoader>(
	'Accessible autocomplete loader',
	{
		providedIn: 'root',
		factory: () => loadAccessibleAutocomplete,
	}
);

/**
 * accessible-autocomplete is loaded on demand so it stays out of the initial bundle.
 * Every caller shares the same import, so the chunk is only downloaded once.
 */
export async function loadAccessibleAutocomplete(): Promise<AccessibleAutocomplete> {
	const module = await import('accessible-autocomplete/dist/accessible-autocomplete.min');
	// The package is a CommonJS (UMD) bundle. In the browser build its lazy chunk only exports `default`
	// (module.exports, which carries enhanceSelectElement); elsewhere the functions may be on the module itself.
	const loaded: { enhanceSelectElement?: unknown; default?: unknown } = module;
	return (loaded.enhanceSelectElement ? loaded : loaded.default) as AccessibleAutocomplete;
}

/**
 * Download the library in the background once the browser is idle, so on slow connections it is usually ready
 * before a form needs it. requestIdleCallback is not available in Safari, so fall back to a short delay.
 */
export function prefetchAccessibleAutocomplete(): void {
	// a failed prefetch is not an error; the form loads the library itself when it needs it
	const load = () => void loadAccessibleAutocomplete().catch(() => {});

	if (typeof window.requestIdleCallback === 'function') {
		window.requestIdleCallback(load, { timeout: 5000 });
	} else {
		setTimeout(load, 2000);
	}
}
