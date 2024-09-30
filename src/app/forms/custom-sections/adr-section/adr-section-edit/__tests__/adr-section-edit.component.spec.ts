import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AdrService } from '@services/adr/adr.service';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { AdrSectionEditComponent } from '../adr-section-edit.component';

describe('AdrSectionEditComponent', () => {
	let store: MockStore;
	let adrService: AdrService;
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
		adrService = TestBed.inject(AdrService);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(AdrSectionEditComponent);
		component = fixture.componentInstance;
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
});
