import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Store } from '@ngrx/store';
import {
	CustomFormControl,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { updateExistingADRAdditionalExaminerNote } from '@store/technical-records';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { ButtonGroupComponent } from '../../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { TextAreaComponent } from '../../../../forms/components/text-area/text-area.component';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'tech-record-edit-additional-examiner-note',
	templateUrl: './tech-record-edit-additional-examiner-note.component.html',
	styleUrls: ['./tech-record-edit-additional-examiner-note.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		TextAreaComponent,
		ButtonGroupComponent,
		ButtonComponent,
		DatePipe,
		DefaultNullOrEmpty,
	],
})
export class TechRecordEditAdditionalExaminerNoteComponent implements OnInit {
	currentTechRecord!: TechRecordType<'hgv' | 'trl' | 'lgv'>;
	examinerNoteIndex!: number;
	editedExaminerNote = '';
	originalExaminerNote = '';
	examinerNoteObj!: AdditionalExaminerNotes;
	destroy$ = new ReplaySubject<boolean>(1);
	form!: FormGroup;
	formControl!: CustomFormControl;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private technicalRecordService: TechnicalRecordService,
		private globalErrorService: GlobalErrorService,
		private store: Store<State>
	) {}

	ngOnInit() {
		this.getTechRecord();
		this.getExaminerNote();
		this.setupForm();
	}

	getTechRecord() {
		this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((currentTechRecord) => {
			this.currentTechRecord = currentTechRecord as TechRecordType<'hgv' | 'lgv' | 'trl'>;
		});
	}

	getExaminerNote() {
		this.route.params.pipe(take(1)).subscribe((params) => {
			this.examinerNoteIndex = params['examinerNoteIndex'];
		});
		const additionalExaminerNotes = this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes;
		if (additionalExaminerNotes) {
			const examinerNote = additionalExaminerNotes[this.examinerNoteIndex].note;
			if (examinerNote) {
				this.examinerNoteObj = additionalExaminerNotes[this.examinerNoteIndex];
				this.originalExaminerNote = examinerNote;
				this.editedExaminerNote = examinerNote;
			}
		}
	}

	setupForm() {
		this.formControl = new CustomFormControl(
			{
				name: 'additionalExaminerNote',
				type: FormNodeTypes.CONTROL,
			},
			'',
			[Validators.required]
		);
		this.form = new FormGroup({
			additionalExaminerNote: this.formControl,
		});
		this.formControl.patchValue(this.editedExaminerNote);
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['../../'], { relativeTo: this.route });
	}

	handleSubmit(): void {
		if (this.originalExaminerNote !== this.editedExaminerNote) {
			this.store.dispatch(
				updateExistingADRAdditionalExaminerNote({
					examinerNoteIndex: this.examinerNoteIndex,
					additionalExaminerNote: this.editedExaminerNote,
				})
			);
		}
		this.navigateBack();
	}

	ngOnChanges(examinerNote: string) {
		this.editedExaminerNote = examinerNote;
	}

	get editTypes(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get width(): typeof FormNodeWidth {
		return FormNodeWidth;
	}
}
