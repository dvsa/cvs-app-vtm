import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestType } from '@models/test-types/testType';
import { TestTypeSelectComponent } from '../../../components/test-type-select/test-type-select.component';

@Component({
	selector: 'app-test-type-select-wrapper',
	templateUrl: './test-type-select-wrapper.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TestTypeSelectComponent],
})
export class TestTypeSelectWrapperComponent {
	router = inject(Router);
	route = inject(ActivatedRoute);

	handleTestTypeSelection(testType: TestType) {
		void this.router.navigate(['..', 'amend-test-details'], {
			queryParams: { testType: testType.id },
			queryParamsHandling: 'merge',
			relativeTo: this.route,
		});
	}
}
