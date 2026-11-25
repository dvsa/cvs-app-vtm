import { afterEach as registerAfterEach, beforeEach as registerBeforeEach, vi } from 'vitest';

type ZoneTestApi = {
	root: {
		fork(spec: object): {
			run<T>(callback: () => T): T;
		};
	};
	ProxyZoneSpec: new () => object;
};

const zone = Reflect.get(globalThis, 'Zone') as ZoneTestApi;
let testProxyZone: ReturnType<typeof zone.root.fork>;

registerBeforeEach(() => {
	testProxyZone = zone.root.fork(new zone.ProxyZoneSpec());
});

registerAfterEach(() => {
	vi.useRealTimers();
});

const wrapRunner = (runner: Function): Function =>
	new Proxy(runner, {
		apply(target, thisArg, args: unknown[]) {
			const callbackIndex = args.findLastIndex((arg) => typeof arg === 'function');
			if (callbackIndex !== -1) {
				const callback = args[callbackIndex] as Function;
				args[callbackIndex] = new Proxy(callback, {
					apply(testCallback, callbackThis, callbackArgs) {
						const proxyZone = testProxyZone ?? zone.root.fork(new zone.ProxyZoneSpec());
						return proxyZone.run(() => Reflect.apply(testCallback, callbackThis, callbackArgs));
					},
					get(testCallback, property, receiver) {
						if (property === 'toString') {
							return () => Reflect.apply(Function.prototype.toString, testCallback, []);
						}
						return Reflect.get(testCallback, property, receiver);
					},
				});
			}
			return Reflect.apply(target, thisArg, args);
		},
		get(target, property, receiver) {
			const value = Reflect.get(target, property, receiver);
			if (typeof value !== 'function') return value;
			if (property === 'each') {
				return (...args: unknown[]) => wrapRunner(Reflect.apply(value, target, args));
			}
			return wrapRunner(value);
		},
	});

for (const name of ['it', 'test', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll']) {
	const runner = Reflect.get(globalThis, name);
	if (typeof runner === 'function') Reflect.set(globalThis, name, wrapRunner(runner));
}

import './global-test-mocks';
