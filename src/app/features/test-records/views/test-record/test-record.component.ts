import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent extends BaseTestRecordComponent implements OnInit {
  constructor(private testRecordsService: TestRecordsService, routerService: RouterService, private router: Router, private route: ActivatedRoute) {
    super(routerService);
  }

  ngOnInit() {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectsData$ = this.testRecordsService.defectData$;
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
