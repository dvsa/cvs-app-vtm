import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RetrieveDocumentDirective } from '@/src/app/directives/retrieve-document/retrieve-document.directive';
import { FieldErrorMessageComponent } from '@/src/app/forms/components/field-error-message/field-error-message.component';
import { DocumentType } from '@/src/app/models/document-type.enum';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { retryInterceptorFailure } from '@/src/app/store/retry-interceptor/retry-interceptor.actions';
import { selectRouteNestedParam } from '@/src/app/store/router/router.selectors';
import { generateADRCertificate, generateADRCertificateSuccess } from '@/src/app/store/technical-records';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import {
	TechRecordGETHGV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

@Component({
	selector: 'app-generate-adr-certificate',
	templateUrl: './generate-adr-certificate.component.html',
	imports: [ButtonComponent, FieldErrorMessageComponent, RetrieveDocumentDirective],
})
export class GenerateAdrCertificateComponent implements OnInit {
	readonly store = inject(Store);
	readonly actions$ = inject(Actions);
	readonly destroyRef = inject(DestroyRef);
	readonly techRecordService = inject(TechnicalRecordService);

	readonly DocumentType = DocumentType;

	readonly systemNumber = this.store.selectSignal(selectRouteNestedParam('systemNumber'));
	readonly createdTimestamp = this.store.selectSignal(selectRouteNestedParam('createdTimestamp'));
	readonly adrCertificateFileName = signal<string | undefined>(undefined);
	readonly adrCertificateError = signal<string | null | undefined>(undefined);

	ngOnInit(): void {
		// TODO: move ADR cert logic into ngrx state
		this.actions$
			.pipe(ofType(generateADRCertificateSuccess), takeUntilDestroyed(this.destroyRef))
			.subscribe(({ id }) => {
				this.adrCertificateFileName.set(id);
			});

		this.actions$.pipe(ofType(retryInterceptorFailure), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
			this.adrCertificateError.set(
				'Try link again or Enter 000000 in Certificate Number and then press "Pass And Issue Documents Centrally" on TAS'
			);
		});
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

	// TODO: move into a ngrx selector
	get lastCertificateDate() {
		let sortedTests: ADRCertificateDetails[] | undefined;
		this.techRecordService.techRecord$.pipe(take(1)).subscribe((record) => {
			sortedTests = (record as TechRecordGETHGV | TechRecordGETTRL).techRecord_adrPassCertificateDetails?.sort(
				(a, b) =>
					a.generatedTimestamp && b.generatedTimestamp
						? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime()
						: 0
			);
		});
		return sortedTests && sortedTests?.length > 0
			? `An ADR certificate was last generated on ${new Date(sortedTests[0].generatedTimestamp).toLocaleDateString('en-UK')}`
			: 'There are no previous ADR certificates for this vehicle';
	}

	documentParams(certificate: string): Map<string, string> {
		return new Map([['fileName', certificate]]);
	}
}
