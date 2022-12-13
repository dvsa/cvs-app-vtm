import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestTypesTaxonomy } from '@api/test-types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum, TestType } from '@models/test-types/test-type.model';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleHeaderComponent {
  @Input() isEditing = false;
  @Input() testResult?: TestResultModel;
  @Input() testNumber?: string | null;
  @Input() isReview = false;

  constructor(private testTypesService: TestTypesService, private techRecordService: TechnicalRecordService) {}

  get test(): TestType | undefined {
    return this.testResult?.testTypes?.find(t => this.testNumber === t.testNumber);
  }

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.testTypesService.selectAllTestTypes$;
  }

  combinedOdometerReading(reading: string | undefined, unit: string | undefined) {
    return `${reading ?? ''} ${(unit && ('kilometres' === unit ? 'km' : 'mi')) ?? ''}`;
  }

  get techRecord$(): Observable<TechRecordModel | undefined> {
    return this.techRecordService.techRecord$;
  }

  get vehicleTypes() {
    return VehicleTypes;
  }

  get referenceDataType() {
    return ReferenceDataResourceType;
  }

  get resultOfTest(): resultOfTestEnum | undefined {
    return this.testResult?.testTypes[0].testResult;
  }

  getVehicleDescription(techRecord: TechRecordModel, vehicleType: VehicleTypes | undefined) {
    switch (vehicleType) {
      case VehicleTypes.TRL:
        return techRecord.vehicleConfiguration ?? '';
      case VehicleTypes.PSV:
        return techRecord.bodyMake && techRecord.bodyModel ? `${techRecord.bodyMake}-${techRecord.bodyModel}` : '';
      case VehicleTypes.HGV:
        return techRecord.make && techRecord.model ? `${techRecord.make}-${techRecord.model}` : '';
      default:
        return 'Unknown Vehicle Type';
    }
  }
}
