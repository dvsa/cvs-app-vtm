import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { State, initialAppState } from '@store/index';
import { AdrTankDetailsInitialInspectionViewComponent } from '../adr-tank-details-initial-inspection-view.component';

describe('AdrTankDetailsInitialInspectionViewComponent', () => {
	let component: AdrTankDetailsInitialInspectionViewComponent;
	let fixture: ComponentFixture<AdrTankDetailsInitialInspectionViewComponent>;

	const control = new CustomFormControl({
		name: 'tankInspectionsInitialView',
		type: FormNodeTypes.CONTROL,
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrTankDetailsInitialInspectionViewComponent],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsInitialInspectionViewComponent, multi: true },
				{
					provide: NgControl,
					useValue: {
						control: { key: control.meta.name, value: control },
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrTankDetailsInitialInspectionViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
