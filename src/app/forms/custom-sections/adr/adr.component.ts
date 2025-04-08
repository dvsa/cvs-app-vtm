import { Component, OnDestroy, OnInit, input, model } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AdrSummaryTemplate } from '@forms/templates/general/adr-summary.template';
import { AdrService } from '@services/adr/adr.service';
import { ReplaySubject, skipWhile, takeUntil } from 'rxjs';

import { RetrieveDocumentDirective } from '../../../directives/retrieve-document/retrieve-document.directive';
import { DynamicFormGroupComponent } from '../../components/dynamic-form-group/dynamic-form-group.component';

@Component({
	selector: 'app-adr',
	templateUrl: './adr.component.html',
	styleUrls: ['./adr.component.scss'],
	imports: [RetrieveDocumentDirective, DynamicFormGroupComponent],
})
export class AdrComponent implements OnInit, OnDestroy {
	techRecord = model.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();
	readonly isEditing = input(false);
	readonly isReviewScreen = input(false);

	template!: FormNode;
	form!: CustomFormGroup;
	destroy$ = new ReplaySubject<boolean>(1);

	constructor(
		private dfs: DynamicFormService,
		private technicalRecordService: TechnicalRecordService,
		private globalErrorService: GlobalErrorService,
		public adrService: AdrService
	) {}

	ngOnInit(): void {
		this.template = this.isReviewScreen() ? AdrSummaryTemplate : AdrTemplate;
		const techRecord = this.techRecord();
		if (techRecord.techRecord_adrDetails_dangerousGoods && !this.isReviewScreen()) {
			techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select =
				this.adrService.determineTankStatementSelect(techRecord);
		}
		this.techRecord.set(this.adrService.preprocessTechRecord(techRecord));
		this.form = this.dfs.createForm(this.template, techRecord) as CustomFormGroup;
		this.handleSubmit();
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	handleFormChange(event: Record<string, unknown>) {
		if (event == null) return;
		const techRecord = this.techRecord();
		if (techRecord == null) return;

		this.form.patchValue(event);
		this.technicalRecordService.updateEditingTechRecord({ ...techRecord, ...event } as TechRecordTypeVerb<'put'>);
	}

	get documentParams(): Map<string, string> {
		return new Map([['adrDocumentId', this.fileName]]);
	}

	get fileName(): string {
		if (this.hasAdrDocumentation()) {
			return this.techRecord().techRecord_adrDetails_documentId ?? '';
		}
		throw new Error('Could not find ADR Documentation.');
	}

	hasAdrDocumentation(): boolean {
		return !!this.techRecord().techRecord_adrDetails_documentId && !this.isEditing();
	}

	handleSubmit() {
		this.globalErrorService.errors$
			.pipe(
				takeUntil(this.destroy$),
				skipWhile((errors) => errors.length === 0)
			)
			.subscribe(() => this.globalErrorService.focusAllControls());
	}
}
