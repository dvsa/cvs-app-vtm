import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MsalGuard } from '@azure/msal-angular';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { RootRoutes } from '@models/routes.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { filter, firstValueFrom, of, throwError } from 'rxjs';
import { AppRoutingModule } from '../../../app-routing.module';
import { SelectRecordComponent } from '../../../features/tech-record/select-record/select-record.component';

@Component({ template: '' })
class DestinationComponent {}

describe('system-number technical record route', () => {
	const search = vi.fn();
	const auth = { canActivate: vi.fn(() => true) };
	const role = { canActivate: vi.fn(() => true) };
	let router: Router;
	let harness: RouterTestingHarness;

	const record = (
		status: TechRecordSearchSchema['techRecord_statusCode'],
		createdTimestamp: string,
		systemNumber = '123'
	): TechRecordSearchSchema => ({
		systemNumber,
		createdTimestamp,
		techRecord_statusCode: status,
		vin: 'VIN123',
		techRecord_vehicleType: 'hgv',
		techRecord_manufactureYear: 2020,
	});

	beforeEach(async () => {
		search.mockReset();
		auth.canActivate.mockReset().mockReturnValue(true);
		role.canActivate.mockReset().mockReturnValue(true);
		TestBed.configureTestingModule({
			imports: [AppRoutingModule],
			providers: [
				{ provide: HttpService, useValue: { searchTechRecordBySystemNumber: search } },
				{ provide: MsalGuard, useValue: auth },
				{ provide: RoleGuard, useValue: role },
				provideMockStore(),
			],
		});
		router = TestBed.inject(Router);
		const root = router.config.find((route) => route.path === RootRoutes.ROOT);
		if (!root?.children) throw new Error('Root routes not found');
		router.resetConfig([
			{
				...root,
				resolve: undefined,
				children: root.children.map((route) =>
					route.path === RootRoutes.CURRENT_TECH_RECORD ? { path: route.path, component: DestinationComponent } : route
				),
			},
			...router.config.filter((route) => route !== root),
		]);
		harness = await RouterTestingHarness.create();
	});

	it.each([
		[
			'current',
			[record('archived', '2026-01-01'), record('current', '2024-01-01'), record('current', '2025-01-01')],
			'2025-01-01',
		],
		[
			'provisional',
			[record('archived', '2026-01-01'), record('provisional', '2024-01-01'), record('provisional', '2025-01-01')],
			'2025-01-01',
		],
		['archived', [record('archived', '2024-01-01'), record('archived', '2025-01-01')], '2025-01-01'],
	])('redirects to the newest %s record', async (_status, results, timestamp) => {
		search.mockReturnValue(of(results));
		await harness.navigateByUrl('/tech-records/123', DestinationComponent);
		expect(search).toHaveBeenCalledExactlyOnceWith('123');
		expect(router.url).toBe(`/tech-records/123/${timestamp}`);
	});

	it.each([
		['current', '2024-01-01'],
		['provisional', '2025-01-01'],
	])('shows both active records and selects the %s record', async (_status, timestamp) => {
		search.mockReturnValue(
			of([
				record('archived', '2026-01-01'),
				record('provisional', '2025-01-01'),
				record('current', '2024-01-01'),
				record('current', '2027-01-01', '456'),
			])
		);
		await harness.navigateByUrl('/tech-records/123', SelectRecordComponent);
		expect(search).toHaveBeenCalledExactlyOnceWith('123');
		expect(router.url).toBe('/tech-records/123');
		const page = harness.routeNativeElement as HTMLElement;
		expect(page.querySelector('h1')?.textContent).toContain('Select a record');
		expect(page.textContent).toContain('Both a current and provisional record are associated with this system number');
		const cards = page.querySelectorAll('app-search-result');
		expect(cards).toHaveLength(2);
		expect(page.textContent).toContain('CURRENT');
		expect(page.textContent).toContain('PROVISIONAL');
		const link = page.querySelector<HTMLAnchorElement>(`a[href="/tech-records/123/${timestamp}"]`);
		expect(link).not.toBeNull();
		const navigation = firstValueFrom(router.events.pipe(filter((event) => event instanceof NavigationEnd)));
		link?.click();
		await navigation;
		expect(router.url).toBe(`/tech-records/123/${timestamp}`);
	});

	it('does not redirect to a record belonging to another system number', async () => {
		search.mockReturnValue(of([record('current', '2026-01-01', '456'), record('archived', '2025-01-01')]));
		await harness.navigateByUrl('/tech-records/123', DestinationComponent);
		expect(router.url).toBe('/tech-records/123/2025-01-01');
	});

	it('updates the selection when navigating to another system number', async () => {
		search
			.mockReturnValueOnce(of([record('current', '2024-01-01'), record('provisional', '2025-01-01')]))
			.mockReturnValueOnce(of([record('current', '2024-01-01', '456'), record('provisional', '2025-01-01', '456')]));
		await harness.navigateByUrl('/tech-records/123', SelectRecordComponent);
		await harness.navigateByUrl('/tech-records/456', SelectRecordComponent);
		const page = harness.routeNativeElement as HTMLElement;
		expect(page.querySelectorAll('app-search-result')).toHaveLength(2);
		expect(page.querySelector('a[href="/tech-records/456/2024-01-01"]')).not.toBeNull();
		expect(page.querySelector('a[href="/tech-records/123/2024-01-01"]')).toBeNull();
	});

	it('searches again when the same link is opened after a record is amended', async () => {
		search
			.mockReturnValueOnce(of([record('current', '2024-01-01T00:00:00.000Z')]))
			.mockReturnValueOnce(
				of([record('archived', '2024-01-01T00:00:00.000Z'), record('current', '2025-01-01T00:00:00.000Z')])
			);
		await harness.navigateByUrl('/tech-records/123', DestinationComponent);
		expect(router.url).toBe('/tech-records/123/2024-01-01T00:00:00.000Z');
		await harness.navigateByUrl('/tech-records/123', DestinationComponent);
		expect(router.url).toBe('/tech-records/123/2025-01-01T00:00:00.000Z');
		expect(search).toHaveBeenCalledTimes(2);
	});

	it.each([of([]), throwError(() => new HttpErrorResponse({ status: 404 }))])(
		'shows not found when there are no records',
		async (result) => {
			search.mockReturnValue(result);
			await harness.navigateByUrl('/tech-records/123');
			expect(router.url).toBe('/not-found');
		}
	);

	it('shows an error when the search fails', async () => {
		search.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503 })));
		await harness.navigateByUrl('/tech-records/123');
		expect(router.url).toBe('/error');
	});

	it('shows an error rather than choosing an invalid timestamp', async () => {
		search.mockReturnValue(of([record('current', 'invalid'), record('current', '2025-01-01')]));
		await harness.navigateByUrl('/tech-records/123');
		expect(router.url).toBe('/error');
	});

	it('shows an error rather than offering an invalid active record link', async () => {
		search.mockReturnValue(of([record('current', '2025-01-01'), record('provisional', 'invalid')]));
		await harness.navigateByUrl('/tech-records/123');
		expect(router.url).toBe('/error');
	});

	it('does not search if access is denied', async () => {
		role.canActivate.mockReturnValue(false);
		await harness.navigateByUrl('/tech-records/123');
		expect(search).not.toHaveBeenCalled();
	});

	it('does not search if the user is not authenticated', async () => {
		auth.canActivate.mockReturnValue(false);
		await harness.navigateByUrl('/tech-records/123');
		expect(search).not.toHaveBeenCalled();
	});

	it('leaves explicit version links unchanged', async () => {
		await harness.navigateByUrl('/tech-records/123/2024-01-01', DestinationComponent);
		expect(router.url).toBe('/tech-records/123/2024-01-01');
		expect(search).not.toHaveBeenCalled();
	});
});
