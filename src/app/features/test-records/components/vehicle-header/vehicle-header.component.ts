import { isTestTypeOldIvaOrMsva } from '@/src/app/store/test-records';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconComponent } from '@components/icon/icon.component';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { TagComponent, TagType, TagTypes } from '@components/tag/tag.component';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleType.enum.js';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import {
	TestResultSchema,
	TestResultTestTypeSchema,
	VehicleType as VehicleTypes,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import {
	ADR_DESK_BASED_TEST_TYPE_IDS,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_GROUP7,
	TEST_TYPES_VTP_VTG_12,
} from '@models/testTypeId.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DigitGroupSeparatorPipe } from '@pipes/digit-group-separator/digit-group-separator.pipe';
import { RefDataDecodePipe } from '@pipes/ref-data-decode/ref-data-decode.pipe';
import { TestTypeNamePipe } from '@pipes/test-type-name/test-type-name.pipe';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { techRecord } from '@store/technical-records';
import { selectAllTestTypes } from '@store/test-types/test-types.selectors';
import { Observable, map } from 'rxjs';

@Component({
	selector: 'app-vehicle-header',
	templateUrl: './vehicle-header.component.html',
	styleUrls: ['./vehicle-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IconComponent,
		FieldWarningMessageComponent,
		NumberPlateComponent,
		TagComponent,
		RetrieveDocumentDirective,
		AsyncPipe,
		UpperCasePipe,
		DatePipe,
		DefaultNullOrEmpty,
		TestTypeNamePipe,
		DigitGroupSeparatorPipe,
		RefDataDecodePipe,
	],
})
export class VehicleHeaderComponent {
	readonly isEditing = input(false);
	readonly testResult = input<TestResultSchema | null>();
	readonly testNumber = input<string | null>();
	readonly isReview = input(false);

	store = inject(Store);
	activatedRoute = inject(ActivatedRoute);
	testRecordsService = inject(TestRecordsService);

	techRecord$ = this.store.select(techRecord);
	isTestTypeOldIvaOrMsva = this.store.selectSignal(isTestTypeOldIvaOrMsva);

	get test(): TestResultTestTypeSchema | undefined {
		return this.testResult()?.testTypes?.find((t) => this.testNumber() === t.testNumber);
	}

	get selectAllTestTypes$() {
		return this.store.select(selectAllTestTypes);
	}

	combinedOdometerReading(reading: string | null | undefined, unit: string | null | undefined) {
		return `${reading ?? ''} ${(unit && (unit === 'kilometres' ? 'km' : 'mi')) ?? ''}`;
	}

	get vehicleTypes() {
		return VehicleType;
	}

	get referenceDataType() {
		return ReferenceDataResourceType;
	}

	get resultOfTest(): string | null | undefined {
		const testResult = this.testResult();
		return testResult?.testStatus === TestStatus.CANCELLED ? TestStatus.CANCELLED : testResult?.testTypes[0].testResult;
	}

	get tagType(): TagTypes {
		switch (this.resultOfTest) {
			case TestResults.PASS:
				return TagType.GREEN;
			case TestResults.PRS:
				return TagType.BLUE;
			case TestResults.FAIL:
				return TagType.RED;
			case TestStatus.CANCELLED:
				return TagType.YELLOW;
			default:
				return TagType.ORANGE;
		}
	}

	get testCode(): string | undefined {
		const testCode = this.testResult()?.testTypes[0].testCode || this.activatedRoute.snapshot?.data?.['testCode'];
		return testCode ? `(${testCode})` : '';
	}

	get recalls(): Observable<RecallsSchema | undefined> {
		return this.testRecordsService.isTestTypeGroupEditable$.pipe(
			map((editable) => (editable ? this.testResult()?.recalls : this.activatedRoute.snapshot?.data?.['recalls']))
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-shadow
	getVehicleDescription(techRecord: V3TechRecordModel, vehicleType: VehicleTypes | undefined) {
		switch (vehicleType) {
			case VehicleType.TRL:
				return (techRecord as TechRecordType<typeof vehicleType>).techRecord_vehicleConfiguration ?? '';
			case VehicleType.PSV:
				return (techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyMake &&
					(techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyModel
					? `${(techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyMake ?? ''}-${
							(techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyModel ?? ''
						}`
					: '';
			case VehicleType.HGV:
				return (techRecord as TechRecordType<typeof vehicleType>).techRecord_make &&
					(techRecord as TechRecordType<typeof vehicleType>).techRecord_model
					? `${(techRecord as TechRecordType<typeof vehicleType>).techRecord_make ?? ''}-${
							(techRecord as TechRecordType<typeof vehicleType>).techRecord_model ?? ''
						}`
					: '';
			case VehicleType.MOTORCYCLE:
			case VehicleType.LGV:
			case VehicleType.CAR:
				return '';
			default:
				return 'Unknown Vehicle Type';
		}
	}

	get isADRTest(): boolean {
		return TEST_TYPES_GROUP7.includes(this.test?.testTypeId as string) || false;
	}

	get shouldShowAbandonCert() {
		const testResult = this.testResult();
		return (
			this.resultOfTest === TestResults.ABANDONED &&
			(testResult?.vehicleType === this.vehicleTypes.HGV ||
				testResult?.vehicleType === this.vehicleTypes.PSV ||
				testResult?.vehicleType === this.vehicleTypes.TRL) &&
			TEST_TYPES_VTP_VTG_12.includes(this.test?.testTypeId as string)
		);
	}

	get abandonCertDocName(): string {
		return `VT${this.testResult()?.vehicleType === this.vehicleTypes.PSV ? 'P' : 'G'}12`;
	}

	get fileName(): string {
		const prefix = this.abandonCertDocName;
		return `${prefix}_${this.testNumber()}`;
	}

	get params(): Map<string, string> {
		return new Map([['fileName', this.fileName]]);
	}

	get certificateParams(): Map<string, string> {
		return new Map([
			['testNumber', this.testNumber() ?? ''],
			['vinNumber', this.testResult()?.vin ?? ''],
		]);
	}

	canDownloadCertificate(test: TestResultSchema): boolean {
		if (this.isReview()) return false;
		if (this.isTestTypeOldIvaOrMsva()) return false; // Old IVA or MSVA tests
		const { testTypeId, testResult } = test.testTypes[0];
		if (testTypeId === '201') return false; // LEC without linked test
		if (['30', '85'].includes(testTypeId)) return false; // Voluntary brake tests
		if (TEST_TYPES_GROUP7.includes(testTypeId)) return false; // ADR tests
		if (ADR_DESK_BASED_TEST_TYPE_IDS.includes(testTypeId)) return false; // Desk-base ADR tests
		if (TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId) && testResult !== TestResults.FAIL) return false; // IVA tests
		if (TEST_TYPES_GROUP5_SPEC_TEST.includes(testTypeId) && testResult !== TestResults.FAIL) return false; // MSVA tests
		return true;
	}

	protected readonly VehicleTypes = VehicleType;
}
