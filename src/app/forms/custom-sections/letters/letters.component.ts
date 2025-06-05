/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { ParagraphIds } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVehicleVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateScrollPosition } from '@store/technical-records';
import { ReplaySubject, Subscription, debounceTime, takeUntil } from 'rxjs';

@Component({
	selector: 'app-letters[techRecord]',
	templateUrl: './letters.component.html',
	styleUrls: ['./letters.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		RetrieveDocumentDirective,
		RoleRequiredDirective,
		ButtonComponent,
		DatePipe,
		DefaultNullOrEmpty,
	],
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
	dynamicFormService = inject(DynamicFormService);
	techRecordService = inject(TechnicalRecordService);
	viewportScroller = inject(ViewportScroller);
	router = inject(Router);
	route = inject(ActivatedRoute);
	store = inject(Store);

	readonly techRecord = input<TechRecordType<'trl'>>();
	readonly isEditing = input(false);

	readonly formChange = output<Record<string, any> | [][]>();

	form!: CustomFormGroup;

	hasCurrent = false;

	private formSubscription = new Subscription();
	private destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.form = this.dynamicFormService.createForm(LettersTemplate, this.techRecord()) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges
			.pipe(debounceTime(400))
			.subscribe((event) => this.formChange.emit(event));
		this.checkForCurrentRecordInHistory();
	}

	ngOnChanges(): void {
		const techRecord = this.techRecord();
		if (techRecord) {
			this.form?.patchValue(techRecord, { emitEvent: false });
		}
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	checkForCurrentRecordInHistory() {
		this.techRecordService.techRecordHistory$
			.pipe(takeUntil(this.destroy$))
			.subscribe((historyArray: TechRecordSearchSchema[] | undefined) => {
				historyArray?.forEach((history: TechRecordSearchSchema) => {
					if (
						history.techRecord_statusCode === StatusCodes.CURRENT &&
						this.techRecord()?.techRecord_statusCode === StatusCodes.PROVISIONAL
					) {
						this.hasCurrent = true;
					}
				});
			});
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get types(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get letter(): LettersOfAuth | undefined {
		const techRecord = this.techRecord();
		return techRecord?.techRecord_letterOfAuth_letterType
			? {
					letterType: techRecord?.techRecord_letterOfAuth_letterType,
					paragraphId: techRecord?.techRecord_letterOfAuth_paragraphId as ParagraphIds,
					letterIssuer: techRecord?.techRecord_letterOfAuth_letterIssuer as string,
					letterDateRequested: techRecord?.techRecord_letterOfAuth_letterDateRequested as string,
					letterContents: '',
				}
			: undefined;
	}

	get eligibleForLetter(): boolean {
		const isArchivedTechRecord = this.techRecord()?.techRecord_statusCode === StatusCodes.ARCHIVED;
		return this.correctApprovalType && !isArchivedTechRecord && !this.isEditing() && !this.hasCurrent;
	}

	get reasonForIneligibility(): string {
		if (this.isEditing()) {
			return 'This section is not available when amending or creating a technical record.';
		}

		const techRecord = this.techRecord();
		if (techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL) {
			if (this.hasCurrent) {
				// eslint-disable-next-line max-len
				return 'Generating letters is not applicable to provisional records, where a current record also exists for a vehicle. Open the current record to generate letters.';
			}
		} else if (techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED) {
			return 'Generating letters is not applicable to archived technical records.';
		}

		if (!this.correctApprovalType) {
			return 'This trailer does not have the right approval type to be eligible for a letter of authorisation.';
		}

		return '';
	}

	get correctApprovalType(): boolean {
		const techRecord = this.techRecord();
		return (
			!!techRecord?.techRecord_approvalType &&
			(Object.values(LettersIntoAuthApprovalType) as string[]).includes(techRecord.techRecord_approvalType.valueOf())
		);
	}

	get documentParams(): Map<string, string> {
		const techRecord = this.techRecord();
		if (!techRecord) {
			throw new Error('Could not find vehicle record associated with this technical record.');
		}
		return new Map([
			['systemNumber', (techRecord as TechRecordTypeVehicleVerb<'trl', 'get'>)?.systemNumber],
			['vinNumber', techRecord?.vin],
		]);
	}

	get fileName(): string {
		if (!this.letter) {
			return '';
		}
		const techRecord = this.techRecord();
		if (!techRecord) {
			return '';
		}
		return `letter_${(techRecord as TechRecordTypeVehicleVerb<'trl', 'get'>).systemNumber}_${techRecord.vin}`;
	}

	generateLetter() {
		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		void this.router.navigate(['generate-letter'], { relativeTo: this.route });
	}
}
