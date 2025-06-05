import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Roles } from '@models/roles.enum';
import { AdrService } from '@services/adr/adr.service';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { RouterService } from '@services/router/router.service';
import { cloneDeep } from 'lodash';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
	selector: 'app-adr-certificate-history',
	templateUrl: './adr-certificate-history.html',
	styleUrls: ['./adr-certificate-history.scss'],
	imports: [RetrieveDocumentDirective, PaginationComponent, RoleRequiredDirective, DatePipe],
})
export class AdrCertificateHistoryComponent extends CustomFormControlComponent {
	readonly currentTechRecord = input<TechRecordType<'hgv' | 'lgv' | 'trl'>>();
	isEditing = false;
	private destroy$ = new Subject<void>();
	routerService = inject(RouterService);
	featureToggleService = inject(FeatureToggleService);
	globalErrorService = inject(GlobalErrorService);
	adrService = inject(AdrService);
	viewportScroller = inject(ViewportScroller);
	router = inject(Router);
	route = inject(ActivatedRoute);
	pageStart?: number;
	pageEnd?: number;

	ngOnInit() {
		this.isEditing$.pipe(takeUntil(this.destroy$)).subscribe((editing) => {
			this.isEditing = editing;
		});
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get isEditing$(): Observable<boolean> {
		return this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));
	}

	get sortedCertificates(): ADRCertificateDetails[] | undefined {
		return cloneDeep(this.currentTechRecord()?.techRecord_adrPassCertificateDetails)?.sort((a, b) =>
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

	get isArchived(): boolean {
		return this.currentTechRecord()?.techRecord_statusCode === 'archived';
	}

	showTable(): boolean {
		return !this.isEditing && this.numberOfADRCertificates > 0;
	}

	get reasonForNoRecords(): string {
		if (this.isEditing) {
			return 'This section is not available when amending or creating a technical record.';
		}
		if (this.numberOfADRCertificates === 0) {
			return 'No ADR certificates found.';
		}
		return '';
	}

	validateADRDetailsAndNavigate(): void {
		this.globalErrorService.clearErrors();
		const currentTechRecord = this.currentTechRecord();
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

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
}
