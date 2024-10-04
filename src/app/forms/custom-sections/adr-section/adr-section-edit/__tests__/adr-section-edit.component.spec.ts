import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { AdrSectionEditComponent } from '../adr-section-edit.component';

describe('AdrSectionEditComponent', () => {
	let store: MockStore;
	let controlContainer: ControlContainer;
	let component: AdrSectionEditComponent;
	let fixture: ComponentFixture<AdrSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			declarations: [AdrSectionEditComponent],
			imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: ControlContainer, useValue: formGroupDirective },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(AdrSectionEditComponent);
		component = fixture.componentInstance;
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
		});

		it('should patch the form with the currently stored vehicle technical record', () => {
			const mockTechRecord = {
				techRecord_adrDetails_applicantDetails_city: 'city',
			} as TechRecordType<'get'>;

			const spy = jest.spyOn(component.form, 'patchValue');
			store.overrideSelector(techRecord, mockTechRecord);
			component.ngOnInit();
			expect(spy).toHaveBeenCalledWith(mockTechRecord);
			expect(component.form.controls.techRecord_adrDetails_applicantDetails_city.value).toBe('city');
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});

		it('should detach its form from its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('addTC3TankInspection', () => {
		it('should add an empty TC3 tank inspection to the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			const spy = jest.spyOn(arr, 'push');
			component.addTC3TankInspection();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('removeTC3TankInspection', () => {
		it('should remove the TC3 tank inspection at the specified index from the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			const spy = jest.spyOn(arr, 'removeAt');
			component.removeTC3TankInspection(1);
			expect(spy).toHaveBeenCalledWith(1);
		});
	});

	describe('addUNNumber', () => {
		it('should not allow the adding of a UN number if the previous one is empty', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			const spy = jest.spyOn(arr, 'push');
			component.addUNNumber();
			expect(spy).not.toHaveBeenCalled();
		});
		it('should add an empty UN number to the form array if the all prior ones are filled in', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			arr.patchValue(['123']);
			const spy = jest.spyOn(arr, 'push');
			component.addUNNumber();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('removeUNNumber', () => {
		it('should remove the UN number at the specified index from the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			const spy = jest.spyOn(arr, 'removeAt');
			component.removeUNNumber(1);
			expect(spy).toHaveBeenCalledWith(1);
		});
	});
});
