import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { Subject, of, throwError } from 'rxjs';
import { routes as referenceDataRoutes } from '../reference-data.routes';
import {
	RequiredStandardsManagementComponent,
	mergeRequiredStandardSections,
} from './required-standards-management.component';

const standard = {
	rsNumber: 1,
	requiredStandard: 'Check the brake',
	refCalculation: '01.1',
	additionalInfo: true,
	inspectionTypes: ['basic', 'normal'] as ('basic' | 'normal')[],
};
const fixtureData: DefectGETRequiredStandards = {
	euVehicleCategories: ['m1' as DefectGETRequiredStandards['euVehicleCategories'][number]],
	basic: [{ sectionNumber: '01', sectionDescription: 'Brakes', requiredStandards: [standard] }],
	normal: [
		{
			sectionNumber: '01',
			sectionDescription: 'Brakes',
			requiredStandards: [
				standard,
				{
					...standard,
					rsNumber: 2,
					requiredStandard: 'Check the wheel',
					refCalculation: '01.2',
					inspectionTypes: [],
				},
			],
		},
		{ sectionNumber: '1', sectionDescription: 'Lights', requiredStandards: [] },
	],
};
const base = '/reference-data/required-standards';
const component = RequiredStandardsManagementComponent;
const routes = [
	{ path: 'reference-data/required-standards', component, data: { mode: 'sections' } },
	{ path: 'reference-data/required-standards/create', component, data: { mode: 'section-create' } },
	{ path: 'reference-data/required-standards/deleted-items', component, data: { mode: 'sections-deleted' } },
	{ path: 'reference-data/required-standards/:category/:sectionNumber', component, data: { mode: 'standards' } },
	{
		path: 'reference-data/required-standards/:category/:sectionNumber/create',
		component,
		data: { mode: 'standard-create' },
	},
	{
		path: 'reference-data/required-standards/:category/:sectionNumber/deleted-items',
		component,
		data: { mode: 'standards-deleted' },
	},
	{
		path: 'reference-data/required-standards/:category/:sectionNumber/amend',
		component,
		data: { mode: 'section-amend' },
	},
	{
		path: 'reference-data/required-standards/:category/:sectionNumber/delete',
		component,
		data: { mode: 'section-delete' },
	},
	{
		path: 'reference-data/required-standards/:category/:sectionNumber/:ref/amend',
		component,
		data: { mode: 'standard-amend' },
	},
	{
		path: 'reference-data/required-standards/:category/:sectionNumber/:ref/delete',
		component,
		data: { mode: 'standard-delete' },
	},
];

describe('Required standards management', () => {
	const fetch = vi.fn();

	beforeEach(() => {
		fetch.mockReset().mockReturnValue(of(fixtureData));
		TestBed.configureTestingModule({
			providers: [
				provideRouter(routes),
				provideMockStore({ initialState: initialAppState }),
				{ provide: HttpService, useValue: { fetchRequiredStandards: fetch } },
				{ provide: UserService, useValue: { roles$: of(['CVSFullAccess']) } },
			],
		});
	});

	it('registers both levels of screens before the generic reference-data route', () => {
		const children = referenceDataRoutes[0].children ?? [];
		const managementIndex = children.findIndex((route) => route.path === 'required-standards');
		const genericIndex = children.findIndex((route) => route.path === ':type');
		expect(managementIndex).toBeGreaterThanOrEqual(0);
		expect(managementIndex).toBeLessThan(genericIndex);
		const managementRoutes = children[managementIndex].children ?? [];
		expect(managementRoutes.map((route) => route.data?.['mode'])).toEqual([
			'sections',
			'section-create',
			'sections-deleted',
			'section-amend',
			'section-delete',
			'standards',
			'standard-create',
			'standards-deleted',
			'standard-amend',
			'standard-delete',
		]);
		expect(
			managementRoutes
				.filter((route) => route.data?.['roles'] === 'CVSFullAccess,ReferenceData.Amend')
				.every((route) => route.canActivate?.length)
		).toBe(true);
	});

	it('merges identical basic and normal records without conflating section numbers', () => {
		const result = mergeRequiredStandardSections(fixtureData);
		expect(result.map((section) => section.sectionNumber)).toEqual(['01', '1']);
		expect(result[0].requiredStandards.map((item) => item.refCalculation)).toEqual(['01.1', '01.2']);
		expect(fixtureData.basic[0].requiredStandards).toHaveLength(1);
	});

	it('sorts section numbers naturally while preserving their original values', async () => {
		const makeSection = (sectionNumber: string) => ({
			sectionNumber,
			sectionDescription: `Section ${sectionNumber}`,
			requiredStandards: [],
		});
		fetch.mockReturnValue(
			of({
				...fixtureData,
				basic: ['10A', '02B', '10', '2'].map(makeSection),
				normal: ['02', 'GC', 'undefined', '02A'].map(makeSection),
			})
		);
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}?category=m1`, component);
		const page = harness.routeNativeElement as HTMLElement;
		const numbers = Array.from(page.querySelectorAll('tbody tr th')).map((cell) => cell.textContent?.trim());
		expect(numbers).toEqual(['2', '02', '02A', '02B', '10', '10A', 'GC', 'undefined']);
		expect(page.querySelector(`a[href="${base}/m1/02"]`)).toBeTruthy();
	});

	it('browses and filters sections and standards for the selected category', async () => {
		const harness = await RouterTestingHarness.create();
		const page = await harness.navigateByUrl(`${base}?category=m1`, component);
		expect(fetch).toHaveBeenCalledWith('m1');
		expect(harness.routeNativeElement?.textContent).toContain('Brakes');
		expect(
			harness.routeNativeElement?.querySelector('a[href="/reference-data/required-standards/m1/01"]')
		).toBeTruthy();
		page.search.setValue('lights');
		page.activeSearch.set(page.search.value);
		harness.detectChanges();
		expect(harness.routeNativeElement?.textContent).not.toContain('Brakes');
		expect(harness.routeNativeElement?.textContent).toContain('Lights');
		await harness.navigateByUrl(`${base}/m1/01`, component);
		expect(harness.routeNativeElement?.textContent).toContain('Check the brake');
		expect(harness.routeNativeElement?.textContent).toContain('Check the wheel');
		expect(
			harness.routeNativeElement?.querySelector('a[href="/reference-data/required-standards/m1/01/01.1/amend"]')
		).toBeTruthy();
	});

	it('searches and clears both lists using the icon toolbar', async () => {
		const harness = await RouterTestingHarness.create();
		for (const [url, type, term, matching, excluded, createUrl, deletedUrl] of [
			[
				`${base}?category=m1`,
				'sections',
				'lights',
				'Lights',
				'Brakes',
				`${base}/create?category=m1`,
				`${base}/deleted-items?category=m1`,
			],
			[
				`${base}/m1/01`,
				'standards',
				'wheel',
				'Check the wheel',
				'Check the brake',
				`${base}/m1/01/create`,
				`${base}/m1/01/deleted-items`,
			],
		]) {
			const componentInstance = await harness.navigateByUrl(url, component);
			const page = harness.routeNativeElement as HTMLElement;
			const searchButton = page.querySelector<HTMLButtonElement>(`#search-${type}`);
			expect(searchButton?.getAttribute('aria-label')).toBeTruthy();
			expect(searchButton?.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
			expect(page.querySelector(`.add-delete-buttons a[href="${createUrl}"]`)).toBeTruthy();
			expect(page.querySelector(`.add-delete-buttons a[href="${deletedUrl}"]`)).toBeTruthy();
			componentInstance.search.setValue(term);
			searchButton?.click();
			harness.detectChanges();
			expect(page.querySelector('tbody')?.textContent).toContain(matching);
			expect(page.querySelector('tbody')?.textContent).not.toContain(excluded);
			page.querySelector<HTMLButtonElement>(`#clear-${type}`)?.click();
			harness.detectChanges();
			expect(componentInstance.search.value).toBe('');
			expect(page.querySelector('tbody')?.textContent).toContain(excluded);
		}
	});

	it('loads the category chosen in the selector', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(base, component);
		expect(fetch).not.toHaveBeenCalled();
		const page = harness.routeNativeElement as HTMLElement;
		const category = page.querySelector<HTMLSelectElement>('#category');
		if (!category) throw new Error('Category selector not found');
		category.value = 'l1e-a';
		category.dispatchEvent(new Event('change'));
		harness.detectChanges();
		page.querySelector<HTMLButtonElement>('button#show-sections')?.click();
		await harness.fixture.whenStable();
		harness.detectChanges();
		expect(fetch).toHaveBeenCalledWith('l1e-a');
		expect(harness.routeNativeElement?.textContent).toContain('Brakes');
	});

	it('shows section actions with search after selecting a category and passes it to create', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(base, component);
		let page = harness.routeNativeElement as HTMLElement;
		expect(page.querySelector('.govuk-warning-text')?.textContent).toContain('You must select an EU vehicle category');
		expect(page.querySelector('#section-search')).toBeNull();
		expect(page.querySelector('.add-delete-buttons')).toBeNull();
		const category = page.querySelector<HTMLSelectElement>('#category');
		if (!category) throw new Error('Category selector not found');
		category.value = 'l1e-a';
		category.dispatchEvent(new Event('change'));
		harness.detectChanges();
		page.querySelector<HTMLButtonElement>('button#show-sections')?.click();
		await harness.fixture.whenStable();
		harness.detectChanges();
		page = harness.routeNativeElement as HTMLElement;
		expect(page.querySelector('.govuk-warning-text')).toBeNull();
		expect(page.querySelector('#section-search')).toBeTruthy();
		expect(page.querySelector('thead')?.textContent).toContain('EU cat.');
		expect(page.querySelector('tbody')?.textContent).toContain('L1E-A');
		const create = page.querySelector<HTMLAnchorElement>(`.add-delete-buttons a[href="${base}/create?category=l1e-a"]`);
		expect(create).toBeTruthy();
		create?.click();
		await harness.fixture.whenStable();
		harness.detectChanges();
		const created = harness.routeDebugElement?.componentInstance as RequiredStandardsManagementComponent;
		expect(created.sectionForm.controls.euVehicleCategory.value).toBe('l1e-a');
		expect(
			(harness.routeNativeElement as HTMLElement).querySelector('a.govuk-button--secondary')?.getAttribute('href')
		).toBe(`${base}?category=l1e-a`);
	});

	it('does not show stale section results when the category selection changes', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}?category=m1`, component);
		const page = harness.routeNativeElement as HTMLElement;
		const category = page.querySelector<HTMLSelectElement>('#category');
		if (!category) throw new Error('Category selector not found');
		category.value = 'n1';
		category.dispatchEvent(new Event('change'));
		harness.detectChanges();
		expect(page.querySelector('#section-search')).toBeNull();
		expect(page.querySelector('.add-delete-buttons')).toBeNull();
		expect(page.querySelector('table')).toBeNull();
		expect(page.textContent).toContain('Select Show sections');
	});

	it('rejects an unrecognised category on the section create page', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}/create?category=invalid`, component);
		expect(harness.routeNativeElement?.textContent).toContain('The vehicle category is not recognised.');
		expect(harness.routeNativeElement?.querySelector('form')).toBeNull();
	});

	it('hides amendment and creation actions from view-only users', async () => {
		TestBed.overrideProvider(UserService, { useValue: { roles$: of(['ReferenceData.View']) } });
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}?category=m1`, component);
		const page = harness.routeNativeElement as HTMLElement;
		expect(page.querySelector(`a[href="${base}/create?category=m1"]`)).toBeNull();
		expect(page.querySelector(`a[href="${base}/m1/01/amend"]`)).toBeNull();
		expect(page.querySelector(`a[href="${base}/m1/01"]`)).not.toBeNull();
	});

	it('preserves section number strings and prepopulates inspection flags on amend', async () => {
		const harness = await RouterTestingHarness.create();
		const sectionPage = await harness.navigateByUrl(`${base}/m1/01/amend`, component);
		expect(sectionPage.sectionForm.getRawValue()).toEqual({
			euVehicleCategory: 'm1',
			sectionNumber: '01',
			sectionDescription: 'Brakes',
		});
		const standardPage = await harness.navigateByUrl(`${base}/m1/01/01.2/amend`, component);
		expect(standardPage.standardForm.getRawValue()).toEqual({
			rsNumber: '2',
			requiredStandard: 'Check the wheel',
			refCalculation: '01.2',
			additionalInfo: true,
			basicInspection: false,
			normalInspection: false,
		});
	});

	it('aligns enabled amend and cancel actions and reports that saving is unavailable', async () => {
		const harness = await RouterTestingHarness.create();
		for (const [url, id] of [
			[`${base}/m1/01/amend`, 'submit-section'],
			[`${base}/m1/01/01.2/amend`, 'submit-standard'],
		]) {
			await harness.navigateByUrl(url, component);
			const page = harness.routeNativeElement as HTMLElement;
			const button = page.querySelector<HTMLButtonElement>(`button#${id}`);
			expect(button?.disabled).toBe(false);
			expect(button?.parentElement?.classList.contains('govuk-button-group')).toBe(true);
			expect(button?.parentElement?.querySelector('a.govuk-button--secondary')?.textContent?.trim()).toBe('Cancel');
			button?.click();
			harness.detectChanges();
			expect(page.querySelector('[role="alert"]')?.textContent).toContain('Changes cannot be saved');
		}
	});

	it('shows empty create forms with all category choices and independent inspection checkboxes', async () => {
		const harness = await RouterTestingHarness.create();
		const sectionPage = await harness.navigateByUrl(`${base}/create`, component);
		expect(sectionPage.categories.map(({ value }) => value)).toEqual(
			expect.arrayContaining([
				'l1e',
				'l1e-a',
				'l2e',
				'l3e',
				'l4e',
				'l5e',
				'l6e',
				'l7e',
				'm1',
				'm2',
				'm3',
				'n1',
				'n2',
				'n3',
				'o1',
				'o2',
				'o3',
				'o4',
			])
		);
		expect(sectionPage.categories).toHaveLength(18);
		expect(sectionPage.sectionForm.controls.sectionNumber.value).toBe('');
		const standardPage = await harness.navigateByUrl(`${base}/m1/01/create`, component);
		expect(standardPage.standardForm.getRawValue()).toEqual({
			rsNumber: '',
			requiredStandard: '',
			refCalculation: '',
			additionalInfo: false,
			basicInspection: false,
			normalInspection: false,
		});
		const page = harness.routeNativeElement as HTMLElement;
		page.querySelector<HTMLInputElement>('#basicInspection-checkbox')?.click();
		page.querySelector<HTMLInputElement>('#normalInspection-checkbox')?.click();
		expect(standardPage.standardForm.controls.basicInspection.value).toBe(true);
		expect(standardPage.standardForm.controls.normalInspection.value).toBe(true);
	});

	it('edits required-standard text in a textarea on create and amend', async () => {
		const harness = await RouterTestingHarness.create();
		for (const [url, initialValue] of [
			[`${base}/m1/01/create`, ''],
			[`${base}/m1/01/01.2/amend`, 'Check the wheel'],
		]) {
			const page = await harness.navigateByUrl(url, component);
			const textarea = harness.routeNativeElement?.querySelector<HTMLTextAreaElement>(
				'govuk-form-group-textarea[formControlName="requiredStandard"] textarea'
			);
			expect(textarea).toBeTruthy();
			if (!textarea) throw new Error('Required standard textarea not found');
			expect(textarea.value).toBe(initialValue);
			textarea.value = 'First line\nSecond line';
			textarea.dispatchEvent(new Event('input'));
			expect(page.standardForm.controls.requiredStandard.value).toBe('First line\nSecond line');
		}
	});

	it('shows delete previews and clearly disables unsupported deletion', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}/m1/01/delete`, component);
		expect(harness.routeNativeElement?.textContent).toContain('Check the brake');
		expect(harness.routeNativeElement?.textContent).toContain('Deletion is not yet available');
		expect(harness.routeNativeElement?.querySelector<HTMLButtonElement>('button#confirm-delete')?.disabled).toBe(true);
		await harness.navigateByUrl(`${base}/m1/01/01.1/delete`, component);
		expect(harness.routeNativeElement?.textContent).toContain('Check the brake');
		expect(harness.routeNativeElement?.querySelector<HTMLButtonElement>('button#confirm-delete')?.disabled).toBe(true);
		expect(
			harness.routeNativeElement?.querySelector('a[href="/reference-data/required-standards/m1/01"]')?.textContent
		).toContain('Cancel');
	});

	it.each([`${base}/deleted-items`, `${base}/m1/01/deleted-items`])(
		'reports unavailable deleted records at %s',
		async (url) => {
			const harness = await RouterTestingHarness.create();
			await harness.navigateByUrl(url, component);
			expect(harness.routeNativeElement?.textContent).toContain('Deleted records are not available');
		}
	);

	it('reports request failures and permits retry', async () => {
		fetch.mockReturnValueOnce(throwError(() => new Error('unavailable'))).mockReturnValue(of(fixtureData));
		const harness = await RouterTestingHarness.create();
		const page = await harness.navigateByUrl(`${base}?category=m1`, component);
		expect(harness.routeNativeElement?.textContent).toContain('could not be loaded');
		page.load();
		harness.detectChanges();
		expect(harness.routeNativeElement?.textContent).toContain('Brakes');
	});

	it('does not open records whose identity is ambiguous', async () => {
		fetch.mockReturnValue(
			of({
				...fixtureData,
				normal: [
					...fixtureData.normal,
					{ sectionNumber: '01', sectionDescription: 'Other', requiredStandards: [standard] },
				],
			})
		);
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}/m1/01`, component);
		expect(harness.routeNativeElement?.textContent).toContain('section number is ambiguous');
		expect(harness.routeNativeElement?.textContent).not.toContain('Try again');
	});

	it('ignores a stale request after changing vehicle category', async () => {
		const first = new Subject<DefectGETRequiredStandards>();
		const second = new Subject<DefectGETRequiredStandards>();
		fetch.mockReturnValueOnce(first).mockReturnValueOnce(second);
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`${base}?category=m1`, component);
		await harness.navigateByUrl(`${base}?category=n1`, component);
		second.next(fixtureData);
		first.next({ ...fixtureData, basic: [], normal: [] });
		harness.detectChanges();
		expect(harness.routeNativeElement?.textContent).toContain('Brakes');
	});
});
