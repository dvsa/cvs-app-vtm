import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { State, initialAppState } from '@store/index';
import { AdrTankDetailsM145ViewComponent } from '../adr-tank-details-m145-view.component';

describe('AdrTankDetailsM145ViewComponent', () => {
	let component: AdrTankDetailsM145ViewComponent;
	let fixture: ComponentFixture<AdrTankDetailsM145ViewComponent>;

	const control = new CustomFormControl({
		name: 'techRecord_adrDetails_m145Statement',
		type: FormNodeTypes.CONTROL,
		value: [],
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AdrTankDetailsM145ViewComponent],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsM145ViewComponent, multi: true },
				{ provide: NgControl, useValue: { control } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrTankDetailsM145ViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
