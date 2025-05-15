import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { LETTER_TYPES } from '@forms/templates/general/letter-types';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormControl,
	FormNodeOption,
	FormNodeTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { generateLetter, generateLetterSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { take } from 'rxjs';
import { ButtonGroupComponent } from '../../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { RadioGroupComponent } from '../../../../forms/components/radio-group/radio-group.component';

@Component({
	selector: 'app-generate-letter',
	templateUrl: './tech-record-generate-letter.component.html',
	styleUrls: ['./tech-record-generate-letter.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, RadioGroupComponent, ButtonGroupComponent, ButtonComponent, AsyncPipe],
})
export class GenerateLetterComponent implements OnInit {
	techRecord?: V3TechRecordModel;
	form = new FormGroup({
		letterType: new CustomFormControl(
			{ name: 'letterType', label: 'Type of letter to generate', type: FormNodeTypes.CONTROL },
			'',
			[Validators.required]
		),
	});
	width: FormNodeWidth = FormNodeWidth.L;

	paragraphMap = new Map<ApprovalType, number>([
		[ApprovalType.GB_WVTA, 6],
		[ApprovalType.UKNI_WVTA, 3],
		[ApprovalType.EU_WVTA_PRE_23, 3],
		[ApprovalType.EU_WVTA_23_ON, 7],
		[ApprovalType.QNIG, 3],
		[ApprovalType.PROV_GB_WVTA, 3],
		[ApprovalType.SMALL_SERIES_NKS, 3],
		[ApprovalType.SMALL_SERIES_NKSXX, 3],
		[ApprovalType.IVA_VCA, 3],
		[ApprovalType.IVA_DVSA_NI, 3],
	]);

	constructor(
		private actions$: Actions,
		public dfs: DynamicFormService,
		private globalErrorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<TechnicalRecordServiceState>,
		private technicalRecordService: TechnicalRecordService,
		public userService: UserService
	) {}

	ngOnInit(): void {
		this.technicalRecordService.techRecord$.pipe(take(1)).subscribe((techRecord) => {
			this.techRecord = techRecord;
		});
		this.actions$.pipe(ofType(generateLetterSuccess), take(1)).subscribe(() => this.navigateBack());
	}

	get reasons(): Array<FormNodeOption<string>> {
		if (this.techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL) {
			return [{ label: 'Trailer rejected', value: LETTER_TYPES[1].value }];
		}
		return [
			{ label: 'Trailer accepted', value: LETTER_TYPES[0].value },
			{ label: 'Trailer rejected', value: LETTER_TYPES[1].value },
		];
	}

	get emailAddress(): string | undefined {
		return this.techRecord?.techRecord_vehicleType === 'trl'
			? (this.techRecord?.techRecord_applicantDetails_emailAddress ?? '')
			: undefined;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(): void {
		this.globalErrorService.clearErrors();
		if (this.form.value.letterType === '') {
			return this.globalErrorService.addError({ error: 'Letter type is required', anchorLink: 'letterType' });
		}
		if (!this.techRecord) {
			return this.globalErrorService.addError({ error: 'Could not retrieve current technical record' });
		}

		const paragraphId =
			this.form.value.letterType === 'trailer acceptance'
				? this.paragraphMap.get((this.techRecord as TechRecordType<'trl'>).techRecord_approvalType as ApprovalType)
				: 4;

		this.store.dispatch(generateLetter({ letterType: this.form.value.letterType, paragraphId: paragraphId ?? 4 }));
	}
}
