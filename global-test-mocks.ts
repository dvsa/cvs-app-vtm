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
