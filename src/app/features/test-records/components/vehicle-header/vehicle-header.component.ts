import { TestRecordsService } from '@/src/app/services/test-records/test-records.service';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagType, TagTypes } from '@components/tag/tag.component';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType, resultOfTestEnum } from '@models/test-types/test-type.model';
import { TEST_TYPES_GROUP7, TEST_TYPES_VTP_VTG_12 } from '@models/testTypeId.enum';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { techRecord } from '@store/technical-records';
import { selectAllTestTypes } from '@store/test-types/test-types.selectors';
import { Observable, map } from 'rxjs';

@Component({
	selector: 'app-vehicle-header',
	templateUrl: './vehicle-header.component.html',
	styleUrls: ['./vehicle-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleHeaderComponent {
	@Input() isEditing = false;
	@Input() testResult?: TestResultModel | null;
	@Input() testNumber?: string | null;
	@Input() isReview = false;

	store = inject(Store);
	activatedRoute = inject(ActivatedRoute);
	testRecordsService = inject(TestRecordsService);

	get test(): TestType | undefined {
		return this.testResult?.testTypes?.find((t) => this.testNumber === t.testNumber);
	}

	get selectAllTestTypes$() {
		return this.store.select(selectAllTestTypes);
	}

	combinedOdometerReading(reading: string | undefined, unit: string | undefined) {
		return `${reading ?? ''} ${(unit && (unit === 'kilometres' ? 'km' : 'mi')) ?? ''}`;
	}

	get techRecord$(): Observable<V3TechRecordModel | undefined> {
		return this.store.select(techRecord);
	}

	get vehicleTypes() {
		return VehicleTypes;
	}

	get referenceDataType() {
		return ReferenceDataResourceType;
	}

	get resultOfTest(): string | undefined {
		return this.testResult?.testStatus === TestResultStatus.CANCELLED
			? TestResultStatus.CANCELLED
			: this.testResult?.testTypes[0].testResult;
	}

	get tagType(): TagTypes {
		switch (this.resultOfTest) {
			case resultOfTestEnum.pass:
				return TagType.GREEN;
			case resultOfTestEnum.prs:
				return TagType.BLUE;
			case resultOfTestEnum.fail:
				return TagType.RED;
			case TestResultStatus.CANCELLED:
				return TagType.YELLOW;
			default:
				return TagType.ORANGE;
		}
	}

	get testCode(): string | undefined {
		const testCode = this.testResult?.testTypes[0].testCode || this.activatedRoute.snapshot?.data?.['testCode'];
		return testCode ? `(${testCode})` : '';
	}

	get recalls(): Observable<RecallsSchema | undefined> {
		return this.testRecordsService.isTestTypeGroupEditable$.pipe(
			map((editable) => (editable ? this.testResult?.recalls : this.activatedRoute.snapshot?.data?.['recalls']))
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-shadow
	getVehicleDescription(techRecord: V3TechRecordModel, vehicleType: VehicleTypes | undefined) {
		switch (vehicleType) {
			case VehicleTypes.TRL:
				return (techRecord as TechRecordType<typeof vehicleType>).techRecord_vehicleConfiguration ?? '';
			case VehicleTypes.PSV:
				return (techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyMake &&
					(techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyModel
					? `${(techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyMake ?? ''}-${
							(techRecord as TechRecordType<typeof vehicleType>).techRecord_bodyModel ?? ''
						}`
					: '';
			case VehicleTypes.HGV:
				return (techRecord as TechRecordType<typeof vehicleType>).techRecord_make &&
					(techRecord as TechRecordType<typeof vehicleType>).techRecord_model
					? `${(techRecord as TechRecordType<typeof vehicleType>).techRecord_make ?? ''}-${
							(techRecord as TechRecordType<typeof vehicleType>).techRecord_model ?? ''
						}`
					: '';
			case VehicleTypes.MOTORCYCLE:
			case VehicleTypes.LGV:
			case VehicleTypes.CAR:
				return '';
			default:
				return 'Unknown Vehicle Type';
		}
	}

	get isADRTest(): boolean {
		return TEST_TYPES_GROUP7.includes(this.test?.testTypeId as string) || false;
	}

	get shouldShowAbandonCert() {
		return (
			this.resultOfTest === resultOfTestEnum.abandoned &&
			(this.testResult?.vehicleType === this.vehicleTypes.HGV ||
				this.testResult?.vehicleType === this.vehicleTypes.PSV ||
				this.testResult?.vehicleType === this.vehicleTypes.TRL) &&
			TEST_TYPES_VTP_VTG_12.includes(this.test?.testTypeId as string)
		);
	}

	get abandonCertDocName(): string {
		return `VT${this.testResult?.vehicleType === this.vehicleTypes.PSV ? 'P' : 'G'}12`;
	}

	get fileName(): string {
		const prefix = this.abandonCertDocName;
		return `${prefix}_${this.testNumber}`;
	}

	get params(): Map<string, string> {
		return new Map([['fileName', this.fileName]]);
	}
}
