import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RetrieveDocumentDirective } from '@/src/app/directives/retrieve-document/retrieve-document.directive';
import { FieldErrorMessageComponent } from '@/src/app/forms/components/field-error-message/field-error-message.component';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { retryInterceptorFailure } from '@/src/app/store/retry-interceptor/retry-interceptor.actions';
import { selectNestedRouteParam } from '@/src/app/store/router/router.selectors';
import { generateADRCertificate, generateADRCertificateSuccess, techRecord } from '@/src/app/store/technical-records';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DocumentType } from '@models/document-type.enum';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-generate-adr-certificate',
	templateUrl: './generate-adr-certificate.component.html',
	styleUrls: ['./generate-adr-certificate.component.scss'],
	imports: [ButtonComponent, FieldErrorMessageComponent, RetrieveDocumentDirective],
})
export class GenerateAdrCertificateComponent implements OnInit {
	readonly store = inject(Store);
	readonly actions = inject(Actions);
	readonly destroyRef = inject(DestroyRef);
	readonly techRecordService = inject(TechnicalRecordService);
	readonly systemNumber = this.store.selectSignal(selectNestedRouteParam('systemNumber'));
	readonly createdTimestamp = this.store.selectSignal(selectNestedRouteParam('createdTimestamp'));
	readonly techRecord = this.store.selectSignal(techRecord);
	readonly adrCertificateFileName = signal<string | null>(null);
	readonly adrCertificateError = signal<string | null>(null);
	readonly lastCertificateDate = computed(() => {
		const techRecord = this.techRecord();
		if (techRecord && this.techRecordService.isAdrVehicle(techRecord)) {
			const sortedTests = techRecord.techRecord_adrPassCertificateDetails?.sort((a, b) =>
				a.generatedTimestamp && b.generatedTimestamp
					? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime()
					: 0
			);

			if (sortedTests && sortedTests.length > 0) {
				return `An ADR certificate was last generated on ${new Date(sortedTests[0].generatedTimestamp).toLocaleDateString('en-UK')}`;
			}
		}

		return 'There are no previous ADR certificates for this vehicle';
	});

	readonly DocumentType = DocumentType;

	ngOnInit(): void {
		this.actions
			.pipe(ofType(generateADRCertificateSuccess), takeUntilDestroyed(this.destroyRef))
			.subscribe(({ id }) => {
				this.adrCertificateFileName.set(id);
			});

		this.actions.pipe(ofType(retryInterceptorFailure), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
			this.adrCertificateError.set(
				'Try link again or Enter 000000 in Certificate Number and then press "Pass And Issue Documents Centrally" on TAS'
			);
		});
	}

	documentParams(certificate: string): Map<string, string> {
		return new Map([['fileName', certificate]]);
	}

	handleGenerateADRCertificateSubmit(): void {
		this.store.dispatch(
			generateADRCertificate({
				systemNumber: this.systemNumber() ?? '',
				createdTimestamp: this.createdTimestamp() ?? '',
				certificateType: 'PASS',
			})
		);
	}
}
