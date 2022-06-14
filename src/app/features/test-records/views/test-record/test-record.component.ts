import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit {
  defectTpl: FormNode = DefectTpl;
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defectsData$: Observable<Defects | undefined> = of(undefined);
  edit$: Observable<boolean> = of(false);

  constructor(private testRecordsService: TestRecordsService, private routerService: RouterService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectsData$ = this.testRecordsService.defectData$;
    this.edit$ = this.routerService.routeEditable$;
  }

  handleEdit() {
    this.router.navigate([], { queryParams: { edit: true }, relativeTo: this.route });
  }

  handleSave() {
    alert('Saved');
  }

  handleCancel() {
    this.router.navigate([], { relativeTo: this.route });
  }
}
