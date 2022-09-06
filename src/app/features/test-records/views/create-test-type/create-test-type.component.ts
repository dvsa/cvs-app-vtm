import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestType } from '@api/test-types';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { contingencyTestTypeSelected } from '@store/test-records';

@Component({
  selector: 'app-create-test-type',
  templateUrl: './create-test-type.component.html',
  styleUrls: ['./create-test-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTestTypeComponent {
  constructor(private store: Store<State>, private router: Router, private route: ActivatedRoute) {}

  handleSelectedTestType(testType: TestType) {
    this.store.dispatch(contingencyTestTypeSelected({ testType: testType.id }));
    this.router.navigate(['..', 'test-details'], {
      queryParams: { testType: testType.id },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
}
