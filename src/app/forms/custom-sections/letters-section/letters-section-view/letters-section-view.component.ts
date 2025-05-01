import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { ParagraphIds } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord, updateScrollPosition } from '@store/technical-records';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-letters-section-view',
	templateUrl: './letters-section-view.component.html',
	styleUrls: ['./letters-section-view.component.scss'],
	imports: [ButtonComponent, DatePipe, DefaultNullOrEmpty, RetrieveDocumentDirective, RoleRequiredDirective],
})
export class LettersSectionViewComponent implements OnInit, OnDestroy {
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	viewportScroller = inject(ViewportScroller);
	router = inject(Router);
	route = inject(ActivatedRoute);

	techRecord = this.store.selectSignal(techRecord);
	hasCurrent = false;
	private destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.checkForCurrentRecordInHistory();
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get eligibleForLetter(): boolean {
		const isArchivedTechRecord = this.techRecord()?.techRecord_statusCode === StatusCodes.ARCHIVED;
		return this.correctApprovalType && !isArchivedTechRecord && !this.hasCurrent;
	}

	get correctApprovalType(): boolean {
		const techRecord = this.techRecord() as TechRecordType<'trl'>;
		return (
			!!techRecord?.techRecord_approvalType &&
			(Object.values(LettersIntoAuthApprovalType) as string[]).includes(
				techRecord.techRecord_approvalType?.valueOf() ?? ''
			)
		);
	}

	get documentParams(): Map<string, string> {
		const techRecord = this.techRecord();
		if (!techRecord) {
			throw new Error('Could not find vehicle record associated with this technical record.');
		}
		return new Map([
			['systemNumber', techRecord?.systemNumber],
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
		return `letter_${techRecord.systemNumber}_${techRecord.vin}`;
	}

	get letter(): LettersOfAuth | undefined {
		const techRecord = this.techRecord() as TechRecordType<'trl'>;
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

	generateLetter() {
		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		void this.router.navigate(['generate-letter'], { relativeTo: this.route });
	}

	get reasonForIneligibility(): string {
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

	checkForCurrentRecordInHistory() {
		this.technicalRecordService.techRecordHistory$
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
}
