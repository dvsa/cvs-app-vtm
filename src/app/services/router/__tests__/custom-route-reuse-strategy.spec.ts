import { ActivatedRouteSnapshot, Route } from '@angular/router';
import { CustomRouteReuseStrategy } from '../custom-route-reuse-strategy';

describe('CustomRouteReuseStrategy', () => {
	const strategy = new CustomRouteReuseStrategy();
	const routeConfig: Route = { path: 'test-record/:id' };
	const snapshot = (config: Route | null, id: string) =>
		Object.assign(new ActivatedRouteSnapshot(), { routeConfig: config, params: { id } });

	it('reuses the component when route configuration and parameters match', () => {
		expect(strategy.shouldReuseRoute(snapshot(routeConfig, '123'), snapshot(routeConfig, '123'))).toBe(true);
	});

	it('recreates the component when a different record uses the same route', () => {
		expect(strategy.shouldReuseRoute(snapshot(routeConfig, '456'), snapshot(routeConfig, '123'))).toBe(false);
	});

	it('does not reuse distinct route configurations even when their paths and parameters match', () => {
		expect(strategy.shouldReuseRoute(snapshot({ ...routeConfig }, '123'), snapshot(routeConfig, '123'))).toBe(false);
	});

	it('ignores query parameter changes for the same record', () => {
		const current = snapshot(routeConfig, '123');
		const future = snapshot(routeConfig, '123');
		current.queryParams = { tab: 'summary' };
		future.queryParams = { tab: 'history' };

		expect(strategy.shouldReuseRoute(future, current)).toBe(true);
	});
});
