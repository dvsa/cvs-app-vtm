import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestType } from '@api/test-types';

@Component({
  selector: 'app-test-type-select-wrapper',
  templateUrl: './test-type-select-wrapper.component.html',
  styleUrls: ['./test-type-select-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestTypeSelectWrapperComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  handleTestTypeSelection(testType: TestType) {
    this.router.navigate(['..', 'amend-test-details'], {
      queryParams: { testType: testType.id },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
}
