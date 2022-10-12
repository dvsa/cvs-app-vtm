import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestTypesTaxonomy } from '@api/test-types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
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

  constructor(private testTypesService: TestTypesService, private techRecordService: TechnicalRecordService) {}

  get test(): TestType | undefined {
    return this.testResult?.testTypes?.find(t => this.testNumber === t.testNumber);
  }

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.testTypesService.selectAllTestTypes$;
  }

  combinedOdometerReading(reading: number | undefined, unit: string | undefined) {
    return `${reading ?? ''} ${(unit && ('kilometres' === unit ? 'km' : 'mi')) ?? ''}`;
  }

  get techRecord$(): Observable<TechRecordModel | undefined> {
    return this.techRecordService.techRecord$;
  }

  get vehicleTypes() {
    return VehicleTypes;
  }

  createHeader(techRecord: TechRecordModel, vehicleType: VehicleTypes) {
    let string = '';

    switch (vehicleType) {
      case VehicleTypes.TRL:
        string = `${techRecord.vehicleConfiguration ? techRecord.vehicleConfiguration : 'Configuration N/A'}`;
        break;
      case VehicleTypes.PSV:
        string = `${techRecord.bodyMake ? techRecord.bodyMake : 'Body Make N/A'}-${techRecord.bodyModel ? techRecord.bodyModel : 'Body Model N/A'}`;
        break;
      case VehicleTypes.HGV:
        string = `${techRecord.chassisMake ? techRecord.chassisMake : 'Chassis Make N/A'}-${
          techRecord.chassisModel ? techRecord.chassisModel : 'Chassis Model N/A'
        }`;
        break;
      default:
        string = 'Could not retrieve vehicle type';
        break;
    }
    return string;
  }
}
