import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { RetrieveDocumentDirective } from '@/src/app/directives/retrieve-document/retrieve-document.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, StatusCodes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectNonViewedCurrentTechRecordFromHistory, updateScrollPosition } from '@/src/app/store/technical-records';
import { DatePipe, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParagraphIds } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { DocumentType } from '@models/document-type.enum';
import { Store } from '@ngrx/store';
import { FieldWarningMessageComponent } from '../../components/field-warning-message/field-warning-message.component';

@Component({
	selector: 'app-letter-of-authorisation',
	templateUrl: './letter-of-authorisation.component.html',
	styleUrls: ['./letter-of-authorisation.component.scss'],
	imports: [
		FieldWarningMessageComponent,
		DefaultNullOrEmpty,
		RetrieveDocumentDirective,
		RoleRequiredDirective,
		ButtonComponent,
		DatePipe,
		NgTemplateOutlet,
	],
})
export class LetterOfAuthorisationComponent {
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);
	viewportScroller = inject(ViewportScroller);
	technicalRecordService = inject(TechnicalRecordService);

	techRecord = input.required<TechRecordType<'trl', 'get'>>();
	currentTechRecord = this.store.selectSignal(selectNonViewedCurrentTechRecordFromHistory);

	Roles = Roles;
	StatusCodes = StatusCodes;

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
		const techRecord = this.techRecord();
		if (!techRecord) return '';
		if (!this.letter) return '';

		return `letter_${techRecord.systemNumber}_${techRecord.vin}`;
	}

	get correctApprovalType(): boolean {
		const techRecord = this.techRecord();
		if (!techRecord) return false;
		if (!techRecord.techRecord_approvalType) return false;

		return (Object.values(LettersIntoAuthApprovalType) as string[]).includes(techRecord.techRecord_approvalType);
	}

	generateLetter() {
		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate(['generate-letter'], { relativeTo: this.route });
	}

	protected readonly DocumentType = DocumentType;
}
