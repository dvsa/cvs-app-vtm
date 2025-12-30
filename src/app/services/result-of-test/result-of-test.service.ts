import { Injectable, inject } from '@angular/core';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { Store, select } from '@ngrx/store';
import {
	resultOfTestSelector,
	setResultOfTest,
	updateResultOfTest,
	updateResultOfTestRequiredStandards,
} from '@store/test-records';

@Injectable({
	providedIn: 'root',
})
export class ResultOfTestService {
	store = inject(Store);

	resultOfTest = this.store.pipe(select(resultOfTestSelector));

	updateResultOfTest() {
		this.store.dispatch(updateResultOfTest());
	}

	updateResultOfTestRequiredStandards() {
		this.store.dispatch(updateResultOfTestRequiredStandards());
	}

	toggleAbandoned(result: TestResults) {
		if (result !== TestResults.ABANDONED) {
			this.store.dispatch(setResultOfTest({ result }));
		} else {
			this.store.dispatch(setResultOfTest({ result }));
			this.updateResultOfTest();
		}
	}
}
