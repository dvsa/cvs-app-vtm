import { ButtonComponent } from '@/src/app/components/button/button.component';
import { PaginationComponent } from '@/src/app/components/pagination/pagination.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@/src/app/directives/retrieve-document/retrieve-document.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { StatusCodes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { AdrService } from '@/src/app/services/adr/adr.service';
import { DatePipe, TitleCasePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Component({
	selector: 'app-adr-certificates',
	templateUrl: './adr-certificates.component.html',
	styleUrls: ['./adr-certificates.component.scss'],
	imports: [
		ButtonComponent,
		RoleRequiredDirective,
		DefaultNullOrEmpty,
		DatePipe,
		PaginationComponent,
		RetrieveDocumentDirective,
		TitleCasePipe,
	],
})
export class AdrCertificatesComponent {
	cdr = inject(ChangeDetectorRef);
	router = inject(Router);
	route = inject(ActivatedRoute);
	adrService = inject(AdrService);
	viewportScroller = inject(ViewportScroller);
	globalErrorService = inject(GlobalErrorService);

	techRecord = input.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();

	pageStart?: number;
	pageEnd?: number;

	Roles = Roles;
	StatusCodes = StatusCodes;

	get sortedCertificates(): ADRCertificateDetails[] | undefined {
		return this.techRecord()?.techRecord_adrPassCertificateDetails?.sort((a, b) =>
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

	getFileName(certificate: ADRCertificateDetails) {
		return certificate.certificateId;
	}

	documentParams(certificate: ADRCertificateDetails): Map<string, string> {
		return new Map([['fileName', this.getFileName(certificate)]]);
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}

	generateADRCertificate(): void {
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

		this.router.navigate(['adr-certificate'], { relativeTo: this.route });
	}
}
