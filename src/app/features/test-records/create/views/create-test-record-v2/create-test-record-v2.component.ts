import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { FormGroupFrom } from '@/src/app/models/form.model';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestTypesService } from '@/src/app/services/test-types/test-types.service';
import { selectTechRecord } from '@/src/app/store/technical-records';
import { testResultInEdit } from '@/src/app/store/test-records';
import { selectTestTypeFromRoute } from '@/src/app/store/test-types/test-types.selectors';
import { user } from '@/src/app/store/user/user-service.reducer';
import { Component, Signal, effect, inject } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	DefectDetailsSchema,
	EUVehicleCategory,
	TestResultSchema,
	TestResultTestTypeSchema,
	TestStationTypes,
	TestStatus,
	TypeOfTest,
	VehicleType,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { getTestStationFromProperty } from '@store/test-stations/test-stations.selectors';
import { ReplaySubject } from 'rxjs';
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';
import { AdditionalDefectsComponent } from './additional-defects/additional-defects.component';
import { CustomDefectsComponent } from './custom-defects/custom-defects.component';
import { DefectsComponent } from './defects/defects.component';
import { EmissionsComponent } from './emissions/emissions.component';
import { NotesComponent } from './notes/notes.component';
import { ReasonForCreationComponent } from './reason-for-creation/reason-for-creation.component';
import { RequiredStandardsComponent } from './required-standards/required-standards.component';
import { SeatbeltComponent } from './seatbelt/seatbelt.component';
import { TestComponent } from './test/test.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { VisitComponent } from './visit/visit.component';

@Component({
	selector: 'app-create-test-record-v2',
	templateUrl: './create-test-record-v2.component.html',
	imports: [
		VehicleHeaderComponent,
		BannerComponent,
		RouterLink,
		ButtonComponent,
		AccordionComponent,
		AccordionControlComponent,
		FormsModule,
		ReactiveFormsModule,
		VehicleDetailsComponent,
		TestComponent,
		VisitComponent,
		EmissionsComponent,
		SeatbeltComponent,
		DefectsComponent,
		NotesComponent,
		ReasonForCreationComponent,
		RequiredStandardsComponent,
		CustomDefectsComponent,
		AdditionalDefectsComponent,
		ButtonGroupComponent,
		ButtonComponent,
	],
})
export class CreateTestRecordV2Component {
	store = inject(Store);
	fb = inject(FormBuilder);
	route = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	testTypesService = inject(TestTypesService);
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);

	user = this.store.selectSignal(user);
	test = this.store.selectSignal(selectTestTypeFromRoute);
	testResult = this.store.selectSignal(testResultInEdit);
	testStation = this.store.selectSignal(getTestStationFromProperty('testStationType', 'hq'));
	techRecord = this.store.selectSignal(selectTechRecord) as Signal<TechRecordType<'get'>>;

	destroy = new ReplaySubject<boolean>(1);

	form = this.fb.nonNullable.group<FormGroupFrom<TestResultSchema>>({
		testResultId: this.fb.nonNullable.control(''),
		testStationName: this.fb.nonNullable.control(null),
		testStationPNumber: this.fb.nonNullable.control(null),
		testStationType: this.fb.nonNullable.control('hq' as TestStationTypes),
		testerName: this.fb.nonNullable.control(null),
		testerStaffId: this.fb.nonNullable.control(''),
		testerEmailAddress: this.fb.nonNullable.control(null),
		testStartTimestamp: this.fb.nonNullable.control(''),
		testEndTimestamp: this.fb.nonNullable.control(''),
		testStatus: this.fb.nonNullable.control('submitted' as TestStatus),
		reasonForCancellation: this.fb.nonNullable.control(null),
		systemNumber: this.fb.nonNullable.control(''),
		vrm: this.fb.nonNullable.control(undefined),
		trailerId: this.fb.nonNullable.control(undefined),
		vin: this.fb.nonNullable.control(''),
		vehicleClass: this.fb.nonNullable.group({
			code: this.fb.nonNullable.control(''),
			description: this.fb.nonNullable.control(''),
		}),
		vehicleSubclass: this.fb.nonNullable.control<string[]>([]),
		vehicleType: this.fb.nonNullable.control('hgv' as VehicleType),
		vehicleConfiguration: this.fb.nonNullable.control(''),
		odometerReading: this.fb.nonNullable.control(undefined),
		odometerReadingUnits: this.fb.nonNullable.control(undefined),
		preparerId: this.fb.nonNullable.control(null),
		preparerName: this.fb.nonNullable.control(null),
		euVehicleCategory: this.fb.nonNullable.control('m1' as EUVehicleCategory),
		countryOfRegistration: this.fb.nonNullable.control(null),
		noOfAxles: this.fb.nonNullable.control(0),
		numberOfWheelsDriven: this.fb.nonNullable.control(null),
		vehicleSize: this.fb.nonNullable.control(undefined),
		numberOfSeats: this.fb.nonNullable.control(undefined),
		regnDate: this.fb.nonNullable.control(undefined),
		firstUseDate: this.fb.nonNullable.control(undefined),
		media: this.fb.nonNullable.control(undefined),
		testTypes: this.fb.nonNullable.array<FormGroup<FormGroupFrom<TestResultTestTypeSchema>>>([
			this.fb.group<FormGroupFrom<TestResultTestTypeSchema>>({
				testTypeName: this.fb.nonNullable.control(null),
				name: this.fb.nonNullable.control(''),
				testTypeId: this.fb.nonNullable.control(''),
				certificateNumber: this.fb.nonNullable.control(null, [this.certifcateNumberValidator()]),
				secondaryCertificateNumber: this.fb.nonNullable.control(null, [this.secondaryCertificateNumberValidator()]),
				testTypeStartTimestamp: this.fb.nonNullable.control(null, [this.validators.date('Test start date and time')]),
				testTypeEndTimestamp: this.fb.nonNullable.control(null, [this.validators.date('Test end date and time')]),
				testResult: this.fb.nonNullable.control(null, [this.testResultValidator()]),
				prohibitionIssued: this.fb.nonNullable.control(null, [this.prohibitionIssuedValidator()]),
				reasonForAbandoning: this.fb.nonNullable.control(null, [this.reasonForAbandonValidator()]),
				additionalNotesRecorded: this.fb.nonNullable.control(null, [
					this.validators.maxLength(500, 'Additional Notes'),
				]),
				additionalCommentsForAbandon: this.fb.nonNullable.control(null, [
					this.validators.maxLength(500, 'Additional Comments'),
				]),
				numberOfSeatbeltsFitted: this.fb.nonNullable.control(undefined, [
					this.validators.max(150, 'Number of seatbelts fitted'),
					this.numberOfSeatbeltsFittedValidator(),
				]),
				lastSeatbeltInstallationCheckDate: this.fb.nonNullable.control(undefined, [
					this.validators.date('Last seatbelt installation check date'),
					this.lastSeatbeltInstallationCheckDateValidator(),
				]),
				seatbeltInstallationCheckDate: this.fb.nonNullable.control(undefined),
				testExpiryDate: this.fb.nonNullable.control(undefined, [
					this.validators.date('Test expiry date'),
					this.testExpiryDateValidator(),
				]),
				testAnniversaryDate: this.fb.nonNullable.control(undefined),
				modType: this.fb.nonNullable.control(undefined),
				emissionStandard: this.fb.nonNullable.control(undefined, [this.emissionStandardValidator()]),
				fuelType: this.fb.nonNullable.control(undefined),
				modificationTypeUsed: this.fb.nonNullable.control(undefined),
				smokeTestKLimitApplied: this.fb.nonNullable.control(undefined, [
					this.validators.max(9.999, 'Smoke test K limit applied'),
					this.smokeTestKLimitAppliedValidator(),
				]),
				particulateTrapFitted: this.fb.nonNullable.control(undefined, [this.particulateTrapFittedValidator()]),
				particulateTrapSerialNumber: this.fb.nonNullable.control(undefined, [
					this.particulateTrapSerialNumberValidator(),
				]),
				defects: this.fb.nonNullable.array<FormGroup<FormGroupFrom<DefectDetailsSchema>>>([]),
				customDefects: this.fb.nonNullable.control(undefined),
				requiredStandards: this.fb.nonNullable.control(undefined),
				testNumber: this.fb.nonNullable.control(undefined, [this.testNumberValidator()]),
				reapplicationDate: this.fb.nonNullable.control(undefined, [this.reapplicationDateValidator()]),
				testCode: this.fb.nonNullable.control(undefined),
				lastUpdatedAt: this.fb.nonNullable.control(undefined),
				createdAt: this.fb.nonNullable.control(undefined),
				testTypeClassification: this.fb.nonNullable.control(undefined),
				deletionFlag: this.fb.nonNullable.control(undefined),
				centralDocs: this.fb.nonNullable.control(undefined),
			}),
		]),
		reasonForCreation: this.fb.nonNullable.control(undefined),
		createdAt: this.fb.nonNullable.control(undefined),
		createdByEmailAddress: this.fb.nonNullable.control(undefined),
		createdByName: this.fb.nonNullable.control(undefined),
		createdById: this.fb.nonNullable.control(undefined),
		lastUpdatedAt: this.fb.nonNullable.control(undefined),
		lastUpdatedByEmailAddress: this.fb.nonNullable.control(undefined),
		lastUpdatedByName: this.fb.nonNullable.control(undefined),
		lastUpdatedById: this.fb.nonNullable.control(undefined),
		shouldEmailCertificate: this.fb.nonNullable.control(undefined),
		contingencyTestNumber: this.fb.nonNullable.control(undefined),
		typeOfTest: this.fb.nonNullable.control(undefined),
		source: this.fb.nonNullable.control(undefined),
		make: this.fb.nonNullable.control(undefined),
		model: this.fb.nonNullable.control(undefined),
		bodyType: this.fb.nonNullable.control(undefined),
		vehicleId: this.fb.nonNullable.control(undefined),
		testHistory: this.fb.nonNullable.control(undefined),
		testVersion: this.fb.nonNullable.control(undefined),
		deletionFlag: this.fb.nonNullable.control(undefined),
		recalls: this.fb.nonNullable.control(undefined),
	});

	constructor() {
		effect(() => this.prepopulateForm());
	}

	private prepopulateForm() {
		const test = this.test();
		const user = this.user();
		const techRecord = this.techRecord();
		const testStation = this.testStation();

		if (!user || !test || !techRecord || !testStation) return;

		const typeOfTest = (test.typeOfTest || 'contingency') as TypeOfTest;

		this.form.patchValue({
			systemNumber: techRecord.systemNumber,
			vrm: techRecord.techRecord_vehicleType === 'trl' ? undefined : techRecord.techRecord_vehicleType,
			trailerId: techRecord.techRecord_vehicleType === 'trl' ? techRecord.trailerId : undefined,
			vin: techRecord.vin,
			vehicleClass: {
				code: this.technicalRecordService.getVehicleClassCode(techRecord),
				description: this.technicalRecordService.getVehicleClassDescription(techRecord),
			},
			vehicleSubclass: this.technicalRecordService.getVehicleSubClass(techRecord),
			vehicleType: techRecord.techRecord_vehicleType,
			vehicleConfiguration: techRecord.techRecord_vehicleConfiguration as string | undefined,
			euVehicleCategory: this.technicalRecordService.getEUVehicleCategory(techRecord) as unknown as EUVehicleCategory,
			noOfAxles: techRecord.techRecord_noOfAxles ?? undefined,
			numberOfWheelsDriven: this.technicalRecordService.getNumberOfWheelsDriven(techRecord),
			vehicleSize: this.technicalRecordService.getVehicleSize(techRecord) as string | undefined,
			// numberOfSeats: @TODO: calculate number of seats
			regnDate: techRecord.techRecord_regnDate,
			firstUseDate: techRecord.techRecord_vehicleType === 'trl' ? techRecord.techRecord_firstUseDate : undefined,
			make: this.technicalRecordService.getMake(techRecord),
			model: this.technicalRecordService.getModel(techRecord),
			bodyType: this.technicalRecordService.getBodyType(techRecord),
			recalls: undefined, // @TODO add recalls
			typeOfTest,
		});

		this.form.controls.testTypes.at(0)?.patchValue({
			testTypeId: test.id,
			testTypeName: test.testTypeName || '',
			name: test.name || '',
		});

		if (typeOfTest !== 'contingency') {
			const now = new Date().toISOString();

			this.form.patchValue({
				testerName: user.name,
				testerEmailAddress: user.userEmail,
				testerStaffId: user.oid,
				testStartTimestamp: now,
				testEndTimestamp: now,
				testStationName: testStation.testStationName,
				testStationPNumber: testStation.testStationPNumber,
				testStationType: 'atf' as TestStationTypes,
			});

			this.form.controls.testTypes.at(0)?.patchValue({
				testTypeStartTimestamp: now,
				testTypeEndTimestamp: now,
			});
		}
	}

	private testResultValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			const test = this.form.getRawValue();
			if (!this.testTypesService.canHaveTestResult(test)) return null;
			if (!this.testTypesService.testResultRequired(test)) return null;
			if (control.value !== null) return null;

			return { required: { error: 'Test result is required', anchorLink: 'testResult', accordion: 'testSection' } };
		};
	}

	private certifcateNumberValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			const test = this.form.getRawValue();
			if (!this.testTypesService.canHaveCertificateNumber(test)) return null;
			if (!this.testTypesService.certifcateNumberRequired(test)) return null;
			if (control.value !== null) return null;

			return {
				required: { error: 'Certifcate number is required', anchorLink: 'certifcateNumber', accordion: 'testSection' },
			};
		};
	}

	private secondaryCertificateNumberValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			// @TODO: make conditionally required
			return null;
		};
	}

	private emissionStandardValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			const test = this.form.getRawValue();
			if (!this.testTypesService.canHaveEmissionsStandard(test)) return null;
			if (!this.testTypesService.emissionStandardRequired(test)) return null;
			if (control.value !== null) return null;

			return {
				required: { error: 'Emissions standard is required', anchorLink: 'emissionStandard', accordion: 'testSection' },
			};
		};
	}

	private prohibitionIssuedValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			// @TODO: make conditionally required
			return null;
		};
	}

	private reasonForAbandonValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			// @TODO: make conditionally required
			return null;
		};
	}

	private numberOfSeatbeltsFittedValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			// @TODO: make conditionally required
			return null;
		};
	}

	private lastSeatbeltInstallationCheckDateValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	private testExpiryDateValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	private smokeTestKLimitAppliedValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	private particulateTrapFittedValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	private particulateTrapSerialNumberValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	private reapplicationDateValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	private testNumberValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!this.form) return null;
			//  @TODO: make conditionally required
			return null;
		};
	}

	review(): void {
		this.form.markAllAsTouched();
		this.globalErrorService.clearErrors();

		if (this.form.invalid) {
			const errors = this.globalErrorService.extractGlobalErrors(this.form);
			this.globalErrorService.setErrors(errors);
		}

		if (this.form.valid) {
			// @TODO: implement
			console.log({ ...this.form.getRawValue() });
		}
	}

	abandon(): void {}
}
