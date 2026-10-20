import { ButtonComponent } from '@/src/app/components/button/button.component';
import { PaginationComponent } from '@/src/app/components/pagination/pagination.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@/src/app/directives/retrieve-document/retrieve-document.directive';
import { hgvRequiredFields, trlRequiredFields, tyreRequiredFields } from '@/src/app/models/plateRequiredFields.model';
import { Roles } from '@/src/app/models/roles.enum';
import { Axle, StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { canGeneratePlate, updateScrollPosition } from '@/src/app/store/technical-records';
import { DatePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DocumentType } from '@models/document-type.enum';
import { Store } from '@ngrx/store';
import { FieldWarningMessageComponent } from '../../components/field-warning-message/field-warning-message.component';

@Component({
	selector: 'app-plates',
	templateUrl: './plates.component.html',
	styleUrls: ['./plates.component.scss'],
	imports: [
		ButtonComponent,
		RoleRequiredDirective,
		FieldWarningMessageComponent,
		DefaultNullOrEmpty,
		DatePipe,
		PaginationComponent,
		RetrieveDocumentDirective,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatesComponent {
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);
	cdr = inject(ChangeDetectorRef);
	viewportScroller = inject(ViewportScroller);
	globalErrorService = inject(GlobalErrorService);

	techRecord = input.required<TechRecordType<'hgv' | 'trl'>>();

	pageStart?: number;
	pageEnd?: number;

	Roles = Roles;
	StatusCodes = StatusCodes;

	get sortedPlates() {
		return this.techRecord()?.techRecord_plates?.sort((a, b) =>
			a.plateIssueDate && b.plateIssueDate
				? new Date(b.plateIssueDate).getTime() - new Date(a.plateIssueDate).getTime()
				: 0
		);
	}

	get plates() {
		return this.sortedPlates?.slice(this.pageStart, this.pageEnd) ?? [];
	}

	get mostRecentPlate() {
		return this.sortedPlates?.at(0);
	}

	get numberOfPlates(): number {
		return this.sortedPlates?.length || 0;
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

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}

	generatePlate(): void {
		const techRecord = this.techRecord();
		const vehicleType = techRecord.techRecord_vehicleType;
		const requiredFields = vehicleType === VehicleTypes.TRL ? trlRequiredFields : hgvRequiredFields;

		this.globalErrorService.clearErrors();

		if (this.isMissingRequiredFields(requiredFields as (keyof TechRecordType<'hgv' | 'trl'>)[])) {
			this.viewportScroller.scrollToPosition([0, 0]);
			this.globalErrorService.addError({ error: 'All fields marked plate are mandatory to generate a plate.' });
			return;
		}

		this.store.dispatch(canGeneratePlate());
		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate(['generate-plate'], { relativeTo: this.route });
	}

	isMissingRequiredFields(requiredFields: (keyof TechRecordType<'hgv' | 'trl'>)[]): boolean {
		const techRecord = this.techRecord();

		// If any of the fields are empty on the tech record, return true
		for (const field of requiredFields) {
			if (techRecord[field] == null || techRecord[field] === '') return true;
		}

		// Only GB Weight of Axle 1 is required
		const noOfAxles = techRecord.techRecord_noOfAxles;
		if (!noOfAxles || noOfAxles < 1) return true;

		const axles = techRecord.techRecord_axles;
		if (!axles || axles[0].weights_gbWeight == null) return true;

		// Check tyre fields
		for (const axle of axles) {
			for (const field of tyreRequiredFields) {
				if (axle[field as keyof Axle] == null || axle[field as keyof Axle] === '') return true;

				// either one of ply rating or load index is required
				const plyRating = axle['tyres_plyRating'];
				const loadIndex = axle['tyres_dataTrAxles'];

				if (!plyRating && !loadIndex) return true;
			}
		}

		return false;
	}

	protected readonly DocumentType = DocumentType;
}
