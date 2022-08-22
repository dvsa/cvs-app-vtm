import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleHeaderComponent {
  @Input() isEditing = false;
  @Input() testResult?: TestResultModel;
  @Input() techRecord?: TechRecordModel | null | undefined;

  get vehicleType(): string {
    return this.techRecord?.vehicleType ?? '';
  }
}
