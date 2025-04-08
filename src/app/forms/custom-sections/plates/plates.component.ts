import { DatePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { HGVPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TRLPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { hgvRequiredFields, trlRequiredFields, tyreRequiredFields } from '@models/plateRequiredFields.model';
import { Roles } from '@models/roles.enum';
import { Axle, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@services/dynamic-forms/dynamic-form.types';
import { canGeneratePlate, updateScrollPosition } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { Subscription, debounceTime } from 'rxjs';
import { ButtonComponent } from '../../../components/button/button.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { RoleRequiredDirective } from '../../../directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '../../../directives/retrieve-document/retrieve-document.directive';
import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-plates[techRecord]',
	templateUrl: './plates.component.html',
	styleUrls: ['./plates.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		RetrieveDocumentDirective,
		PaginationComponent,
		RoleRequiredDirective,
		ButtonComponent,
		DatePipe,
		DefaultNullOrEmpty,
	],
})
export class PlatesComponent implements OnInit, OnDestroy, OnChanges {
	readonly techRecord = input.required<TechRecordType<'hgv' | 'trl'>>();
	readonly isEditing = input(false);

	readonly formChange = output<Record<string, any> | [][]>();

	form!: CustomFormGroup;
	pageStart?: number;
	pageEnd?: number;

	private formSubscription = new Subscription();

	constructor(
		private dynamicFormService: DynamicFormService,
		private cdr: ChangeDetectorRef,
		private globalErrorService: GlobalErrorService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<TechnicalRecordServiceState>,
		private viewportScroller: ViewportScroller
	) {}

	ngOnInit(): void {
		this.form = this.dynamicFormService.createForm(PlatesTemplate, this.techRecord()) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges
			.pipe(debounceTime(400))
			.subscribe((event) => this.formChange.emit(event));
	}

	ngOnChanges(): void {
		this.form?.patchValue(this.techRecord(), { emitEvent: false });
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get types(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get hasPlates(): boolean {
		return !!this.techRecord().techRecord_plates?.length;
	}

	get sortedPlates(): HGVPlates[] | TRLPlates[] | undefined {
		return cloneDeep(this.techRecord().techRecord_plates)?.sort((a, b) =>
			a.plateIssueDate && b.plateIssueDate
				? new Date(b.plateIssueDate).getTime() - new Date(a.plateIssueDate).getTime()
				: 0
		);
	}

	get plates() {
		return this.sortedPlates?.slice(this.pageStart, this.pageEnd) ?? [];
	}

	get mostRecentPlate() {
		return cloneDeep(this.techRecord().techRecord_plates)
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

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
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
		return this.techRecord().techRecord_statusCode === StatusCodes.CURRENT && !this.isEditing();
	}

	get reasonForIneligibility(): string {
		if (this.isEditing()) {
			return 'This section is not available when amending or creating a technical record.';
		}

		if (this.techRecord().techRecord_statusCode !== StatusCodes.CURRENT) {
			return 'Generating plates is only applicable to current technical records.';
		}
		return '';
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
}
