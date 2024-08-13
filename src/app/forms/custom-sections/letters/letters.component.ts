/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { ParagraphIds } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVehicleVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateScrollPosition } from '@store/technical-records';
import { ReplaySubject, Subscription, debounceTime, takeUntil } from 'rxjs';

@Component({
	selector: 'app-letters[techRecord]',
	templateUrl: './letters.component.html',
	styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
	@Input() techRecord?: TechRecordType<'trl'>;
	@Input() isEditing = false;

	@Output() formChange = new EventEmitter();

	form!: CustomFormGroup;

	hasCurrent = false;

	private formSubscription = new Subscription();
	private destroy$ = new ReplaySubject<boolean>(1);

	constructor(
		private dynamicFormService: DynamicFormService,
		private techRecordService: TechnicalRecordService,
		private viewportScroller: ViewportScroller,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store
	) {}

	ngOnInit(): void {
		this.form = this.dynamicFormService.createForm(LettersTemplate, this.techRecord) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges
			.pipe(debounceTime(400))
			.subscribe((event) => this.formChange.emit(event));
		this.checkForCurrentRecordInHistory();
	}

	ngOnChanges(): void {
		if (this.techRecord) {
			this.form?.patchValue(this.techRecord, { emitEvent: false });
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
						this.techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL
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
		return this.techRecord?.techRecord_letterOfAuth_letterType
			? {
					letterType: this.techRecord?.techRecord_letterOfAuth_letterType,
					paragraphId: this.techRecord?.techRecord_letterOfAuth_paragraphId as ParagraphIds,
					letterIssuer: this.techRecord?.techRecord_letterOfAuth_letterIssuer as string,
					letterDateRequested: this.techRecord?.techRecord_letterOfAuth_letterDateRequested as string,
					letterContents: '',
				}
			: undefined;
	}

	get eligibleForLetter(): boolean {
		const isArchivedTechRecord = this.techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED;
		return this.correctApprovalType && !isArchivedTechRecord && !this.isEditing && !this.hasCurrent;
	}

	get reasonForIneligibility(): string {
		if (this.isEditing) {
			return 'This section is not available when amending or creating a technical record.';
		}

		if (this.techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL) {
			if (this.hasCurrent) {
				// eslint-disable-next-line max-len
				return 'Generating letters is not applicable to provisional records, where a current record also exists for a vehicle. Open the current record to generate letters.';
			}
		} else if (this.techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED) {
			return 'Generating letters is not applicable to archived technical records.';
		}

		if (!this.correctApprovalType) {
			return 'This trailer does not have the right approval type to be eligible for a letter of authorisation.';
		}

		return '';
	}

	get correctApprovalType(): boolean {
		return (
			!!this.techRecord?.techRecord_approvalType &&
			(Object.values(LettersIntoAuthApprovalType) as string[]).includes(
				this.techRecord.techRecord_approvalType.valueOf()
			)
		);
	}

	get documentParams(): Map<string, string> {
		if (!this.techRecord) {
			throw new Error('Could not find vehicle record associated with this technical record.');
		}
		return new Map([
			['systemNumber', (this.techRecord as TechRecordTypeVehicleVerb<'trl', 'get'>)?.systemNumber],
			['vinNumber', this.techRecord?.vin],
		]);
	}

	get fileName(): string {
		if (!this.letter) {
			return '';
		}
		if (!this.techRecord) {
			return '';
		}
		return `letter_${(this.techRecord as TechRecordTypeVehicleVerb<'trl', 'get'>).systemNumber}_${this.techRecord.vin}`;
	}

	generateLetter() {
		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		void this.router.navigate(['generate-letter'], { relativeTo: this.route });
	}
}
