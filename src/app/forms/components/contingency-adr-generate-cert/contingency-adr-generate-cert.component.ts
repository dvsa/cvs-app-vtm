import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import {
	TechRecordGETHGV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LoadingService } from '@services/loading/loading.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { retryInterceptorFailure } from '@store/retry-interceptor/retry-interceptor.actions';
import { generateADRCertificate, generateADRCertificateSuccess } from '@store/technical-records';
import { Subject, take, takeUntil } from 'rxjs';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-contingency-adr-generate-cert',
	templateUrl: './contingency-adr-generate-cert.component.html',
	styleUrls: ['./contingency-adr-generate-cert.component.scss'],
	imports: [ButtonComponent, FieldErrorMessageComponent, RetrieveDocumentDirective],
})
export class ContingencyAdrGenerateCertComponent extends CustomFormControlComponent {
	systemNumber?: string;
	createdTimestamp?: string;
	store = inject(Store<State>);
	techRecordService = inject(TechnicalRecordService);
	actions$ = inject(Actions);
	loading = inject(LoadingService);
	fileName?: string;
	errorString?: string | null;

	private destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.techRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((record) => {
			this.systemNumber = (record as TechRecordGETHGV).systemNumber;
			this.createdTimestamp = (record as TechRecordGETHGV).createdTimestamp;
		});

		this.actions$.pipe(ofType(generateADRCertificateSuccess), takeUntil(this.destroy$)).subscribe(({ id }) => {
			this.fileName = id;
			this.cdr.detectChanges();
		});

		this.actions$.pipe(ofType(retryInterceptorFailure), takeUntil(this.destroy$)).subscribe(() => {
			this.errorString =
				'Try link again or Enter 000000 in Certificate Number and then press "Pass And Issue Documents Centrally" on TAS';
			this.cdr.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

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

	handleSubmit(): void {
		this.store.dispatch(
			generateADRCertificate({
				systemNumber: this.systemNumber ?? '',
				createdTimestamp: this.createdTimestamp ?? '',
				certificateType: 'PASS',
			})
		);
	}
}
