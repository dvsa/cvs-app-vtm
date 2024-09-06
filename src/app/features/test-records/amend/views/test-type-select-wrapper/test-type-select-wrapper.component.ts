import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestType } from '@models/test-types/testType';

@Component({
	selector: 'app-test-type-select-wrapper',
	templateUrl: './test-type-select-wrapper.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestTypeSelectWrapperComponent {
	constructor(
		private router: Router,
		private route: ActivatedRoute
	) {}

	handleTestTypeSelection(testType: TestType) {
		void this.router.navigate(['..', 'amend-test-details'], {
			queryParams: { testType: testType.id },
			queryParamsHandling: 'merge',
			relativeTo: this.route,
		});
	}
}
