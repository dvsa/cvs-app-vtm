import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestTypesTaxonomy } from '@api/test-types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
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
  @Input() techRecord?: TechRecordModel | null | undefined;
  @Input() testNumber?: string;

  constructor(private testTypesService: TestTypesService) {}

  get vehicleType(): string {
    return this.techRecord?.vehicleType ?? '';
  }

  get test(): TestType | undefined {
    return this.testResult?.testTypes?.find(t => this.testNumber === t.testNumber);
  }

  get testResultType(): 'red' | 'green' {
    return (<Record<string, 'red' | 'green'>>{ pass: 'green', prs: 'green', fail: 'red' })[this.test?.testResult ?? 'pass'];
  }

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.testTypesService.selectAllTestTypes$;
  }
}
