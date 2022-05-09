import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { map, Observable } from 'rxjs';
import { FormNode } from 'src/app/forms/services/dynamic-form.types';
import { PsvAnnual } from '../../../../forms/templates/psv/psv-annual.template';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-records.component.html',
  styleUrls: ['./test-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent {
  testResult$: Observable<TestResultModel | undefined>;
  template: FormNode;

  constructor(private testRecordsService: TestRecordsService, public routerService: RouterService) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.template = PsvAnnual;
    this.routerService.getQueryParam('edit').subscribe((val) => {
      console.log('type of edir:', typeof val);
      console.log(val);
    });
  }

  get edit() {
    return this.routerService.getQueryParam('edit').pipe(map((val) => val === 'true'));
  }
}
