import { DatePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, Signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Roles } from '@models/roles.enum';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'app-adr-certs-section-view',
	templateUrl: './adr-certs-section-view.component.html',
	styleUrls: ['./adr-certs-section-view.component.scss'],
	imports: [DatePipe, PaginationComponent, RetrieveDocumentDirective, RoleRequiredDirective],
})
export class AdrCertsSectionViewComponent {
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	globalErrorService = inject(GlobalErrorService);
	adrService = inject(AdrService);
	viewportScroller = inject(ViewportScroller);
	router = inject(Router);
	route = inject(ActivatedRoute);
	cdr = inject(ChangeDetectorRef);

	pageStart?: number;
	pageEnd?: number;

	techRecord = this.store.selectSignal(techRecord) as Signal<TechRecordType<'hgv' | 'lgv' | 'trl'>>;

	getFileName(certificate: ADRCertificateDetails) {
		return certificate.certificateId;
	}
	documentParams(certificate: ADRCertificateDetails): Map<string, string> {
		return new Map([['fileName', this.getFileName(certificate)]]);
	}

	get isArchived(): boolean {
		return this.techRecord()?.techRecord_statusCode === 'archived';
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get sortedCertificates(): ADRCertificateDetails[] | undefined {
		return cloneDeep(this.techRecord()?.techRecord_adrPassCertificateDetails)?.sort((a, b) =>
			a.generatedTimestamp && b.generatedTimestamp
				? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime()
				: 0
		);
	}

	get adrCertificateHistory(): ADRCertificateDetails[] {
		return this.sortedCertificates?.slice(this.pageStart, this.pageEnd) || [];
	}

	get numberOfADRCertificates(): number {
		return this.sortedCertificates?.length || 0;
	}

	showTable(): boolean {
		return this.numberOfADRCertificates > 0;
	}

	validateADRDetailsAndNavigate(): void {
		this.globalErrorService.clearErrors();
		const currentTechRecord = this.techRecord();
		if (currentTechRecord) {
			if (!this.adrService.carriesDangerousGoods(currentTechRecord)) {
				this.viewportScroller.scrollToPosition([0, 0]);
				this.globalErrorService.addError({
					error:
						'This vehicle is not able to carry dangerous goods, add ADR details to the technical record to generate a certificate.',
				});
				return;
			}
		}

		void this.router.navigate(['adr-certificate'], { relativeTo: this.route });
	}

	get reasonForNoRecords(): string {
		return this.numberOfADRCertificates === 0 ? 'No ADR certificates found.' : '';
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
}
