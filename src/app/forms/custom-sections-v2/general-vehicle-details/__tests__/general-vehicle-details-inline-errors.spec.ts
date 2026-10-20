import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GeneralVehicleDetailsComponent } from '@forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

const mockRefDataService = {
	getAll$: jest.fn(() => of([])),
	getReferencePsvMakeDataLoading$: jest.fn(() => of(false)),
};

/**
 * Regression test for inline errors disappearing on submit. markAllAsTouched mutates the controls
 * from outside the template, which left fields whose inputs never change identity rendering stale
 * markup: 'Body type' showed its error while 'Vehicle configuration' did not, despite both controls
 * being touched and invalid.
 */
describe('GeneralVehicleDetailsComponent inline errors on submit', () => {
	let fixture: ComponentFixture<GeneralVehicleDetailsComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv'>, FormControl>>>({
			techRecord_noOfAxles: new FormControl(0),
		});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, GeneralVehicleDetailsComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				TechnicalRecordService,
				{ provide: MultiOptionsService, useValue: { getOptions: jest.fn(() => of([])), loadOptions: jest.fn() } },
				{ provide: ReferenceDataService, useValue: mockRefDataService },
				AxlesService,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(GeneralVehicleDetailsComponent);
		fixture.componentRef.setInput('techRecord', mockVehicleTechnicalRecord('hgv') as V3TechRecordModel);
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
	});

	it('should render the inline error of every touched, invalid required field', () => {
		const { form } = fixture.componentInstance;
		form.get('techRecord_vehicleConfiguration')?.reset();
		form.get('techRecord_bodyType_description')?.reset();
		fixture.detectChanges();

		// mirrors what the submit handler does
		TestBed.inject(GlobalErrorService).markAllAsTouched(formGroupDirective.form);
		fixture.detectChanges();

		const messages = fixture.debugElement
			.queryAll(By.css('.govuk-error-message'))
			.map((element) => element.nativeElement.textContent.trim());

		expect(messages).toEqual(expect.arrayContaining(['Error: Vehicle configuration is required']));
		expect(messages).toEqual(expect.arrayContaining(['Error: Body type is required']));
	});
});
