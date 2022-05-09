import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { map, Observable } from 'rxjs';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
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

  @ViewChild(DynamicFormGroupComponent) dynamicForm?: DynamicFormGroupComponent;

  constructor(private testRecordsService: TestRecordsService, public routerService: RouterService, private router: Router, private route: ActivatedRoute) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.template = PsvAnnual;
  }

  get edit() {
    return this.routerService.getQueryParam('edit').pipe(map((val) => val === 'true'));
  }

  handleEdit() {
    this.router.navigate([], { queryParams: { edit: true }, relativeTo: this.route });
  }

  handleSave() {
    alert(JSON.stringify(this.dynamicForm?.form.value, null, 2));
  }

  handleCancel() {
    this.router.navigate([], { relativeTo: this.route });
  }
}
