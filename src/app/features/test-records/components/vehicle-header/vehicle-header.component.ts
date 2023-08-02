import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestTypesTaxonomy } from '@api/test-types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum, TestType } from '@models/test-types/test-type.model';
import { TechRecordModel, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { TagType } from '@shared/components/tag/tag.component';
import { selectTechRecord } from '@store/technical-records';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleHeaderComponent {
  @Input() isEditing = false;
  @Input() testResult?: TestResultModel | null;
  @Input() testNumber?: string | null;
  @Input() isReview = false;

  constructor(private testTypesService: TestTypesService, private techRecordService: TechnicalRecordService, private store: Store) {}

  get test(): TestType | undefined {
    return this.testResult?.testTypes?.find(t => this.testNumber === t.testNumber);
  }

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.testTypesService.selectAllTestTypes$;
  }

  combinedOdometerReading(reading: string | undefined, unit: string | undefined) {
    return `${reading ?? ''} ${(unit && ('kilometres' === unit ? 'km' : 'mi')) ?? ''}`;
  }

  get techRecord$(): Observable<V3TechRecordModel | undefined> {
    return this.store.select(selectTechRecord);
  }

  get vehicleTypes() {
    return VehicleTypes;
  }

  get referenceDataType() {
    return ReferenceDataResourceType;
  }

  get resultOfTest(): string | undefined {
    return this.testResult?.testStatus === TestResultStatus.CANCELLED ? TestResultStatus.CANCELLED : this.testResult?.testTypes[0].testResult;
  }

  get tagType(): TagType {
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
    const testCode = this.testResult?.testTypes[0].testCode;
    return testCode ? `(${testCode})` : '';
  }

  getVehicleDescription(techRecord: V3TechRecordModel, vehicleType: VehicleTypes | undefined) {
    switch (vehicleType) {
      case VehicleTypes.TRL:
        return techRecord.techRecord_vehicleConfiguration ?? '';
      case VehicleTypes.PSV:
        return (techRecord as any).techRecord_bodyMake && (techRecord as any).techRecord_bodyModel
          ? `${(techRecord as any).bodyMake}-${(techRecord as any).bodyModel}`
          : '';
      case VehicleTypes.HGV:
      case VehicleTypes.LGV:
      case VehicleTypes.CAR:
      case VehicleTypes.SMALL_TRL:
      case VehicleTypes.MOTORCYCLE:
        return (techRecord as any).techRecord_make && (techRecord as any).techRecord_model
          ? `${(techRecord as any).techRecord_make}-${(techRecord as any).techRecord_model}`
          : '';
      default:
        return 'Unknown Vehicle Type';
    }
  }
}
