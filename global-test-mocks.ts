(globalThis as any).CSS = null;

const createStorage = () => {
	let storage: { [key: string]: any } = {};
	return {
		getItem: (key: string) => (key in storage ? storage[key] : null),
		setItem: (key: string, value: any) => (storage[key] = value || ''),
		removeItem: (key: string) => delete storage[key],
		clear: () => (storage = {}),
	};
};

Object.defineProperty(window, 'localStorage', { value: createStorage() });
Object.defineProperty(window, 'sessionStorage', { value: createStorage() });
Object.defineProperty(document, 'doctype', {
	value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
	value: () => ({
		display: 'none',
		appearance: ['-webkit-appearance'],
	}),
});

// jsdom does not implement these and logs "Not implemented" on every call; stub them so specs stay quiet
// (they remain writable, so individual specs can still spy on them)
Object.defineProperty(window, 'alert', { value: () => {}, writable: true, configurable: true });
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true, configurable: true });
