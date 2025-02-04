import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { HGVPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TRLPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { hgvRequiredFields, trlRequiredFields, tyreRequiredFields } from '@models/plateRequiredFields.model';
import { Roles } from '@models/roles.enum';
import { Axle, StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { canGeneratePlate, updateScrollPosition } from '@store/technical-records';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'app-plates-section-view',
	templateUrl: './plates-section-view.component.html',
	styleUrls: ['./plates-section-view.component.scss'],
})
export class PlatesSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = input.required<TechRecordType<'hgv' | 'trl'>>();
	globalErrorService = inject(GlobalErrorService);
	viewportScroller = inject(ViewportScroller);
	router = inject(Router);
	route = inject(ActivatedRoute);
	cdr = inject(ChangeDetectorRef);
	pageStart?: number;
	pageEnd?: number;

	get sortedPlates(): HGVPlates[] | TRLPlates[] | undefined {
		return cloneDeep(this.techRecord()?.techRecord_plates)?.sort((a, b) =>
			a.plateIssueDate && b.plateIssueDate
				? new Date(b.plateIssueDate).getTime() - new Date(a.plateIssueDate).getTime()
				: 0
		);
	}

	get plates() {
		return this.sortedPlates?.slice(this.pageStart, this.pageEnd) ?? [];
	}

	get mostRecentPlate() {
		return cloneDeep(this.techRecord()?.techRecord_plates)
			?.sort((a, b) =>
				a.plateIssueDate && b.plateIssueDate
					? new Date(a.plateIssueDate).getTime() - new Date(b.plateIssueDate).getTime()
					: 0
			)
			?.pop();
	}

	get numberOfPlates(): number {
		return this.sortedPlates?.length || 0;
	}

	handlePaginationChange({ start, end }: { start: number; end: number }) {
		this.pageStart = start;
		this.pageEnd = end;
		this.cdr.detectChanges();
	}

	trackByFn(i: number, tr: HGVPlates | TRLPlates) {
		return tr.plateIssueDate;
	}

	get documentParams(): Map<string, string> {
		return new Map([['plateSerialNumber', this.fileName]]);
	}

	get fileName(): string {
		if (this.mostRecentPlate) {
			return `plate_${this.mostRecentPlate.plateSerialNumber}`;
		}
		throw new Error('Could not find plate.');
	}

	get eligibleForPlates(): boolean {
		return this.techRecord()?.techRecord_statusCode === StatusCodes.CURRENT;
	}

	validateTechRecordPlates(): void {
		this.globalErrorService.clearErrors();
		const plateValidationTable =
			this.techRecord().techRecord_vehicleType === 'trl' ? trlRequiredFields : hgvRequiredFields;

		if (this.cannotGeneratePlate(plateValidationTable)) {
			this.viewportScroller.scrollToPosition([0, 0]);
			this.globalErrorService.addError({ error: 'All fields marked plate are mandatory to generate a plate.' });
			return;
		}
		this.store.dispatch(canGeneratePlate());
		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		void this.router.navigate(['generate-plate'], { relativeTo: this.route });
	}

	cannotGeneratePlate(plateRequiredFields: string[]): boolean {
		const isOneFieldEmpty = plateRequiredFields.some((field) => {
			const value = this.techRecord()[field as keyof TechRecordType<'hgv' | 'trl'>];
			return value === undefined || value === null || value === '';
		});

		// Only gbWeight of Axle 1 is required
		const { techRecord_noOfAxles: noOfAxles, techRecord_axles: axles } = this.techRecord();
		const areAxlesInvalid = !noOfAxles || noOfAxles < 1 || !axles || axles[0].weights_gbWeight == null;

		// check tyre fields
		const areTyresInvalid = this.techRecord().techRecord_axles?.some((axle) => {
			const tyreRequiredInvalid = tyreRequiredFields.map((field) => {
				const value = axle[field as keyof Axle<'hgv'>];
				return value === undefined || value === null || value === '';
			});

			if (tyreRequiredInvalid.some((value) => value)) {
				return true;
			}
			// either one of ply rating or load index is required
			const plyOrLoad = axle['tyres_plyRating' as keyof Axle<'hgv'>] || axle['tyres_dataTrAxles' as keyof Axle<'hgv'>];
			return plyOrLoad === undefined || plyOrLoad === null || plyOrLoad === '';
		});

		return isOneFieldEmpty || areAxlesInvalid || !!areTyresInvalid;
	}

	get reasonForIneligibility(): string {
		if (this.techRecord().techRecord_statusCode !== StatusCodes.CURRENT) {
			return 'Generating plates is only applicable to current technical records.';
		}
		return '';
	}

	get roles(): typeof Roles {
		return Roles;
	}
}
