import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectTechRecord } from '@/src/app/store/technical-records';
import { testResultInEdit } from '@/src/app/store/test-records';
import { selectTestTypeFromRoute } from '@/src/app/store/test-types/test-types.selectors';
import { user } from '@/src/app/store/user/user-service.reducer';
import { Component, Signal, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';

type FormGroupFrom<T> = {
	[K in keyof T]: T[K] extends object
		? T[K] extends Array<infer U>
			? FormArray<FormGroup<FormGroupFrom<U>>>
			: FormGroup<FormGroupFrom<T[K]>>
		: FormControl<T[K]>;
};

@Component({
	selector: 'app-create-test-record-v2',
	templateUrl: './create-test-record-v2.component.html',
	imports: [VehicleHeaderComponent],
})
export class CreateTestRecordV2Component {
	store = inject(Store);
	fb = inject(FormBuilder);
	route = inject(ActivatedRoute);
	technicalRecordService = inject(TechnicalRecordService);

	user = this.store.selectSignal(user);
	test = this.store.selectSignal(selectTestTypeFromRoute);
	testResult = this.store.selectSignal(testResultInEdit);
	testStation = this.store.selectSignal(getTestStationFromProperty('testStationType', 'hq'));
	techRecord = this.store.selectSignal(selectTechRecord) as Signal<TechRecordType<'get'>>;

	form = this.fb.group<FormGroupFrom<TestResultSchema>>({
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
				certificateNumber: this.fb.nonNullable.control(null),
				secondaryCertificateNumber: this.fb.nonNullable.control(null),
				testTypeStartTimestamp: this.fb.nonNullable.control(null),
				testTypeEndTimestamp: this.fb.nonNullable.control(null),
				testResult: this.fb.nonNullable.control(null),
				prohibitionIssued: this.fb.nonNullable.control(null),
				reasonForAbandoning: this.fb.nonNullable.control(null),
				additionalNotesRecorded: this.fb.nonNullable.control(null),
				additionalCommentsForAbandon: this.fb.nonNullable.control(null),
				numberOfSeatbeltsFitted: this.fb.nonNullable.control(undefined),
				lastSeatbeltInstallationCheckDate: this.fb.nonNullable.control(undefined),
				seatbeltInstallationCheckDate: this.fb.nonNullable.control(undefined),
				testExpiryDate: this.fb.nonNullable.control(undefined),
				testAnniversaryDate: this.fb.nonNullable.control(undefined),
				modType: this.fb.nonNullable.control(undefined),
				emissionStandard: this.fb.nonNullable.control(undefined),
				fuelType: this.fb.nonNullable.control(undefined),
				modificationTypeUsed: this.fb.nonNullable.control(undefined),
				smokeTestKLimitApplied: this.fb.nonNullable.control(undefined),
				particulateTrapFitted: this.fb.nonNullable.control(undefined),
				particulateTrapSerialNumber: this.fb.nonNullable.control(undefined),
				defects: this.fb.nonNullable.array<FormGroup<FormGroupFrom<DefectDetailsSchema>>>([]),
				customDefects: this.fb.nonNullable.control(undefined),
				requiredStandards: this.fb.nonNullable.control(undefined),
				testNumber: this.fb.nonNullable.control(undefined),
				reapplicationDate: this.fb.nonNullable.control(undefined),
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
}
