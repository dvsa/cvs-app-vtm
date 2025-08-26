import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { TEST_TYPES_GROUP1_SPEC_TEST, TEST_TYPES_GROUP5_SPEC_TEST } from '@models/testTypeId.enum';
import { Store, select } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { State } from '@store/index';
import { isTestTypeOldIvaOrMsva, toEditOrNotToEdit } from '@store/test-records';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
	selector: 'app-test-certificate[testNumber][vin]',
	templateUrl: './test-certificate.component.html',
	styleUrls: ['./test-certificate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RetrieveDocumentDirective, NgClass],
})
export class TestCertificateComponent implements OnInit, OnDestroy {
	store: Store<State> = inject(Store<State>);
	featureToggleService = inject(FeatureToggleService);
	readonly testNumber = input.required<string>();
	readonly vin = input.required<string>();
	readonly isClickable = input(true);
	certNotNeeded = false;
	private destroyed$ = new Subject<void>();

	ngOnInit(): void {
		const isRequiredStandardsEnabled = this.featureToggleService.isFeatureEnabled('requiredstandards');
		combineLatest([this.store.pipe(select(toEditOrNotToEdit)), this.store.pipe(select(isTestTypeOldIvaOrMsva))])
			.pipe(takeUntil(this.destroyed$))
			.subscribe(([testResult, isOldIvaOrMsva]) => {
				if (testResult && isRequiredStandardsEnabled) {
					const { testResult: result, testTypeId: id } = testResult.testTypes[0];
					const isIvaOrMsvaTest = TEST_TYPES_GROUP1_SPEC_TEST.includes(id) || TEST_TYPES_GROUP5_SPEC_TEST.includes(id);
					this.certNotNeeded = isOldIvaOrMsva || (isIvaOrMsvaTest && result !== resultOfTestEnum.fail);
				}
			});
	}

	get documentParams(): Map<string, string> {
		return new Map([
			['testNumber', this.testNumber()],
			['vinNumber', this.vin()],
		]);
	}

	get fileName(): string {
		return `${this.testNumber()}_${this.vin()}`;
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
