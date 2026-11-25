import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { defectsLoadingState, deleteDefect, selectDefectCategoryFromRoute } from '@store/defects';
import { of } from 'rxjs';
import { DefectCategoryDeleteComponent } from './defect-category-delete.component';

describe('DefectCategoryDeleteComponent', () => {
	let fixture: ComponentFixture<DefectCategoryDeleteComponent>;
	let store: MockStore;
	const category: DefectCategoryReferenceDataSchema = {
		imNumber: 1,
		imDescription: 'Registration plates',
		forVehicleType: ['hgv'],
		additionalInfo: { psv: {}, hgv: {}, trl: {} },
		items: [
			{
				itemNumber: 1,
				itemDescription: 'Condition',
				deficiencies: [
					{
						ref: '1.1.a',
						deficiencyId: 'a',
						deficiencySubId: '',
						deficiencyText: 'A registration plate missing',
						deficiencyCategory: 'Major',
						stdForProhibition: true,
						forVehicleType: ['hgv'],
					},
				],
			},
			{ itemNumber: 2, itemDescription: 'Visibility' },
		],
	};
	const errors = { clearErrors: vi.fn(), setErrors: vi.fn() };

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DefectCategoryDeleteComponent],
			providers: [
				provideRouter([]),
				provideMockStore({
					selectors: [
						{ selector: selectDefectCategoryFromRoute, value: category },
						{ selector: defectsLoadingState, value: false },
					],
				}),
				{ provide: UserService, useValue: { roles$: of(['CVSFullAccess']) } },
				{ provide: GlobalErrorService, useValue: errors },
			],
		});
		store = TestBed.inject(MockStore);
		vi.spyOn(store, 'dispatch');
		fixture = TestBed.createComponent(DefectCategoryDeleteComponent);
		fixture.detectChanges();
	});

	it('summarises only defect items in a single table while retaining the deletion warning', () => {
		const page: HTMLElement = fixture.nativeElement;
		expect(page.querySelector('h1')?.textContent?.trim()).toBe(
			'Confirm delete of defect category: Registration plates'
		);
		expect(page.querySelector('.govuk-hint')?.textContent?.trim()).toBe(
			'Confirming deletion will also delete associated defect items and their related deficiences'
		);
		const rows = page.querySelectorAll('table > tbody > tr');
		expect(page.querySelectorAll('table')).toHaveLength(1);
		expect(rows).toHaveLength(2);
		expect(rows[0].querySelector('th')?.textContent?.trim()).toBe('1.1');
		expect(rows[0].querySelector('td')?.textContent?.trim()).toBe('Condition');
		expect(rows[1].querySelector('th')?.textContent?.trim()).toBe('1.2');
		expect(rows[1].querySelector('td')?.textContent?.trim()).toBe('Visibility');
		expect(page.textContent).not.toContain('A registration plate missing');
		expect(page.querySelector('button#submit')?.classList).toContain('govuk-button--warning');
		expect(page.querySelector('button#cancel')?.classList).toContain('govuk-button--secondary');
	});

	it('deletes only on confirmation and blocks duplicate submissions while loading', () => {
		expect(store.dispatch).not.toHaveBeenCalled();
		fixture.componentInstance.handleSubmit();
		expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(deleteDefect({ id: 1 }));
		store.overrideSelector(defectsLoadingState, true);
		store.refreshState();
		fixture.detectChanges();
		fixture.componentInstance.handleSubmit();
		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(fixture.nativeElement.querySelector('button#submit').disabled).toBe(true);
	});

	it('cancels back to the category list preserving filters without deleting', async () => {
		const router = TestBed.inject(Router);
		router.resetConfig([
			{ path: 'reference-data/defects/:imNumber/delete', children: [] },
			{ path: 'reference-data/defects', children: [] },
		]);
		await router.navigateByUrl('/reference-data/defects/1/delete?forVehicleType=hgv');
		fixture.componentInstance.handleCancel();
		await fixture.whenStable();
		expect(router.url).toBe('/reference-data/defects?forVehicleType=hgv');
		expect(store.dispatch).not.toHaveBeenCalled();
	});

	it('handles empty categories and prevents deletion when the category is missing', () => {
		store.overrideSelector(selectDefectCategoryFromRoute, { ...category, items: [] });
		store.refreshState();
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('No defect items.');

		store.overrideSelector(selectDefectCategoryFromRoute, undefined);
		store.refreshState();
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Defect category not found');
		expect(fixture.nativeElement.querySelector('button#submit').disabled).toBe(true);
		fixture.componentInstance.handleSubmit();
		expect(errors.setErrors).toHaveBeenCalledWith([{ error: 'The defect category could not be found.' }]);
		expect(store.dispatch).not.toHaveBeenCalled();
	});
});
