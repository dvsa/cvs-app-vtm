import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import {
	selectDefectCategoryFromRoute,
	selectDefectDeficiencyFromRoute,
	selectDefectItemFromRoute,
} from '@store/defects';
import { of } from 'rxjs';
import { DefectDeficiencyAmendComponent } from '../defect-deficiency-amend/defect-deficiency-amend.component';
import { DefectDeficiencyCreateComponent } from '../defect-deficiency-create/defect-deficiency-create.component';
import { DefectItemAmendComponent } from '../defect-item-amend/defect-item-amend.component';
import { DefectItemCreateComponent } from '../defect-item-create/defect-item-create.component';

type DefectForm =
	| DefectItemCreateComponent
	| DefectItemAmendComponent
	| DefectDeficiencyCreateComponent
	| DefectDeficiencyAmendComponent;

describe.each([
	{ name: 'item create', component: DefectItemCreateComponent, selected: [] },
	{ name: 'item amend', component: DefectItemAmendComponent, selected: ['psv', 'trl'] },
	{ name: 'deficiency create', component: DefectDeficiencyCreateComponent, selected: [] },
	{ name: 'deficiency amend', component: DefectDeficiencyAmendComponent, selected: ['hgv', 'trl'] },
] satisfies { name: string; component: Type<DefectForm>; selected: string[] }[])(
	'$name vehicle types',
	({ component, selected }) => {
		let fixture: ComponentFixture<DefectForm>;
		let store: MockStore;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [component],
				providers: [
					provideRouter([]),
					provideMockStore({
						selectors: [
							{ selector: selectDefectCategoryFromRoute, value: undefined },
							{ selector: selectDefectItemFromRoute, value: { itemNumber: 1, forVehicleType: ['psv', 'trl'] } },
							{
								selector: selectDefectDeficiencyFromRoute,
								value: {
									ref: '1.1.a',
									deficiencyId: 'a',
									deficiencySubId: '',
									deficiencyCategory: 'major',
									deficiencyText: 'A defect',
									stdForProhibition: false,
									forVehicleType: ['hgv', 'trl'],
								},
							},
						],
					}),
					{ provide: UserService, useValue: { roles$: of(['CVSFullAccess']) } },
				],
			});
			store = TestBed.inject(MockStore);
			fixture = TestBed.createComponent(component);
			fixture.detectChanges();
		});

		it('shows selectable PSV, HGV and TRL options and updates the form', () => {
			const page: HTMLElement = fixture.nativeElement;
			expect(page.textContent).toContain('For vehicle type');
			for (const type of ['psv', 'hgv', 'trl']) {
				const checkbox = page.querySelector<HTMLInputElement>(`#forVehicleType-${type}-checkbox`);
				expect(checkbox?.checked).toBe(selected.includes(type));
			}
			const psv = page.querySelector<HTMLInputElement>('#forVehicleType-psv-checkbox');
			expect(psv).not.toBeNull();
			psv?.click();
			fixture.detectChanges();
			expect(fixture.componentInstance.form.controls.forVehicleType.value).toEqual(
				selected.includes('psv') ? selected.filter((type) => type !== 'psv') : [...selected, 'psv']
			);
		});

		it('preserves vehicle types not represented by the checkboxes when another option changes', () => {
			fixture.componentInstance.form.controls.forVehicleType.setValue(['car']);
			fixture.detectChanges();
			fixture.nativeElement.querySelector('#forVehicleType-hgv-checkbox').click();
			expect(fixture.componentInstance.form.controls.forVehicleType.value).toEqual(['car', 'hgv']);
		});

		if (component === DefectItemAmendComponent) {
			it('handles an item without vehicle types', () => {
				store.overrideSelector(selectDefectItemFromRoute, { itemNumber: 1 });
				store.refreshState();
				fixture.detectChanges();
				expect(fixture.componentInstance.form.controls.forVehicleType.value).toEqual([]);
			});
		}

		if (component === DefectDeficiencyAmendComponent) {
			it('accepts a single vehicle type in the reference-data schema', () => {
				store.overrideSelector(selectDefectDeficiencyFromRoute, {
					ref: '1.1.a',
					deficiencyId: 'a',
					deficiencySubId: '',
					deficiencyCategory: 'major',
					deficiencyText: 'A defect',
					stdForProhibition: false,
					forVehicleType: 'hgv',
				});
				store.refreshState();
				fixture.detectChanges();
				expect(fixture.componentInstance.form.controls.forVehicleType.value).toEqual(['hgv']);
				expect(fixture.nativeElement.querySelector('#forVehicleType-hgv-checkbox').checked).toBe(true);
			});
		}
	}
);
