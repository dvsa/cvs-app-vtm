import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { DynamicFormFieldComponent } from '../dynamic-form-field.component';

describe('DynamicFormFieldComponent', () => {
	let component: DynamicFormFieldComponent;
	let fixture: ComponentFixture<DynamicFormFieldComponent>;
	let service: ReferenceDataService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DynamicFormFieldComponent, FormsModule, ReactiveFormsModule],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				TestStationsService,
				{ provide: UserService, useValue: {} },
			],
		}).compileComponents();
		service = TestBed.inject(ReferenceDataService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DynamicFormFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.componentRef.setInput('control', {
			key: 'birthday',
			value: new CustomFormControl({
				name: 'test',
				type: FormNodeTypes.CONTROL,
				referenceData: ReferenceDataResourceType.CountryOfRegistration,
			}),
		});
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get options', () => {
		const options = component.options$;
		expect(options).toBeTruthy();
	});

	it('should return the metadata options', (done) => {
		fixture.componentRef.setInput('control', {
			key: 'birthday',
			value: new CustomFormControl({
				name: 'test',
				type: FormNodeTypes.CONTROL,
				options: [{ value: '1', label: 'test' }],
			}),
		});
		fixture.componentRef.setInput('form', new FormGroup({}));
		component.options$.subscribe((value) => {
			expect(value).toBeTruthy();
			expect(value).toEqual([{ value: '1', label: 'test' }]);
			done();
		});
	});

	it('should return the reference data options', (done) => {
		service.getAll$ = jest.fn().mockReturnValue(of([{ resourceKey: '1', description: 'test' }]));
		fixture.componentRef.setInput('form', new FormGroup({}));
		component.options$.subscribe((value) => {
			expect(value).toBeTruthy();
			expect(value).toEqual([{ value: '1', label: 'test' }]);
			done();
		});
	});

	it('should fetch the reference data on init', () => {
		service.loadReferenceData = jest.fn();
		component.ngAfterContentInit();
		const spy = jest.spyOn(service, 'loadReferenceData');
		expect(spy).toHaveBeenCalled();
	});
});
