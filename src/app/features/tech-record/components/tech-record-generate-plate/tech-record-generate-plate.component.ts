import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { PlatesInner } from '@models/vehicle/platesInner';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
	CustomFormControl,
	FormNodeOption,
	FormNodeTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import {
	cannotGeneratePlate,
	generatePlate,
	generatePlateSuccess,
	getCanGeneratePlate,
} from '@store/technical-records';
import { Observable, map, take, tap } from 'rxjs';
import { ButtonGroupComponent } from '../../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { RadioGroupComponent } from '../../../../forms/components/radio-group/radio-group.component';

@Component({
	selector: 'app-generate-plate',
	templateUrl: './tech-record-generate-plate.component.html',
	styleUrls: ['./tech-record-generate-plate.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, RadioGroupComponent, ButtonGroupComponent, ButtonComponent, AsyncPipe],
})
export class GeneratePlateComponent implements OnInit {
	form = new FormGroup({
		reason: new CustomFormControl(
			{ name: 'reason', label: 'Reason for generating plate', type: FormNodeTypes.CONTROL },
			'',
			[Validators.required]
		),
	});

	emailAddress$?: Observable<string | undefined | null>;

	constructor(
		private actions$: Actions,
		private globalErrorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<State>,
		public userService: UserService,
		private technicalRecordService: TechnicalRecordService
	) {}

	ngOnInit(): void {
		this.actions$.pipe(ofType(generatePlateSuccess), take(1)).subscribe(() => {
			this.navigateBack();
		});
		this.store.pipe(select(getCanGeneratePlate), take(1)).subscribe((canGeneratePlate) => {
			if (!canGeneratePlate) {
				this.navigateBack();
			}
		});
		this.emailAddress$ = this.technicalRecordService.techRecord$.pipe(
			tap((record) => {
				if (record?.techRecord_vehicleType !== 'hgv' && record?.techRecord_vehicleType !== 'trl') this.navigateBack();
			}),
			map((record) => {
				if (record?.techRecord_vehicleType !== 'hgv' && record?.techRecord_vehicleType !== 'trl') {
					return undefined;
				}
				return record?.techRecord_applicantDetails_emailAddress;
			})
		);
	}

	get width(): FormNodeWidth {
		return FormNodeWidth.L;
	}

	get reasons(): Array<FormNodeOption<string>> {
		return [
			{ label: 'Free replacement', value: PlatesInner.PlateReasonForIssueEnum.FreeReplacement },
			{ label: 'Replacement', value: PlatesInner.PlateReasonForIssueEnum.Replacement },
			{ label: 'Destroyed', value: PlatesInner.PlateReasonForIssueEnum.Destroyed },
			{ label: 'Provisional', value: PlatesInner.PlateReasonForIssueEnum.Provisional },
			{ label: 'Original', value: PlatesInner.PlateReasonForIssueEnum.Original },
			{ label: 'Manual', value: PlatesInner.PlateReasonForIssueEnum.Manual },
		];
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(): void {
		this.globalErrorService.clearErrors();
		if (!this.form.value.reason) {
			return this.globalErrorService.addError({
				error: 'Reason for generating plate is required',
				anchorLink: 'reason',
			});
		}
		this.store.dispatch(generatePlate({ reason: this.form.value.reason }));
		this.store.dispatch(cannotGeneratePlate());
	}
}
