import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { State, initialAppState } from '@store/index';
import { AdrTankDetailsSubsequentInspectionsViewComponent } from '../adr-tank-details-subsequent-inspections-view.component';

describe('AdrTankDetailsSubsequentInspectionsViewComponent', () => {
	let component: AdrTankDetailsSubsequentInspectionsViewComponent;
	let fixture: ComponentFixture<AdrTankDetailsSubsequentInspectionsViewComponent>;

	const control = new CustomFormControl({
		name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
		type: FormNodeTypes.CONTROL,
		value: [],
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AdrTankDetailsSubsequentInspectionsViewComponent],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsSubsequentInspectionsViewComponent, multi: true },
				{ provide: NgControl, useValue: { control } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrTankDetailsSubsequentInspectionsViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
