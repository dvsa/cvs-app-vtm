import { AfterContentInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestType } from '@api/test-types';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/.';
import { clearAllSectionStates, selectTechRecord } from '@store/technical-records';
import { contingencyTestTypeSelected } from '@store/test-records';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-test-type',
  templateUrl: './create-test-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTestTypeComponent implements AfterContentInit {
  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngAfterContentInit(): void {
    this.technicalRecordService.techRecord$.pipe(take(1)).subscribe(techRecord => {
      if ((techRecord as any)?.techRecord_hiddenInVta) {
        alert('Vehicle record is hidden in VTA.\n\nShow the vehicle record in VTA to start recording tests against it.');

        this.router.navigate(['../../..'], { relativeTo: this.route });
      } else if (techRecord?.techRecord_recordCompleteness !== 'complete' && techRecord?.techRecord_recordCompleteness !== 'testable') {
        alert(
          'Incomplete vehicle record.\n\n' +
            'This vehicle does not have enough data to be tested. ' +
            'Call Technical Support to correct this record and use SAR to test this vehicle.'
        );

        this.router.navigate(['../../..'], { relativeTo: this.route });
      }
    });
  }

  handleSelectedTestType(testType: TestType) {
    this.store.dispatch(contingencyTestTypeSelected({ testType: testType.id }));
    this.store.dispatch(clearAllSectionStates());
    this.router.navigate(['..', 'test-details'], {
      queryParams: { testType: testType.id },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
}
