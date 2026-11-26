import { Injectable, inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TestRecordComponent } from '@features/test-records/amend/views/test-record-wrapper/test-record/test-record.component';
import { Store } from '@ngrx/store';
import { TestService } from '@services/test/test.service';
import { cancelEditingTestResult } from '@store/test-records';

@Injectable({
	providedIn: 'root',
})
export class CancelEditTestGuard implements CanDeactivate<TestRecordComponent> {
	store = inject(Store);
	testService = inject(TestService);

	canDeactivate(): boolean {
		this.store.dispatch(cancelEditingTestResult());
		this.testService.resetForm();
		return true;
	}
}
