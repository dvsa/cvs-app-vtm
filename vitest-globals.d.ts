declare global {
	type Mock = import('vitest').Mock;
	type Mocked<T> = import('vitest').Mocked<T>;
}

export {};
