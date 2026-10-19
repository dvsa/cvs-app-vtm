import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalError } from '@/src/app/core/components/global-error/global-error.interface';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { TEST_TYPES_GROUP1_SPEC_TEST } from '@/src/app/models/testTypeId.enum';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	TouchedChangeEvent,
	ValidationErrors,
} from '@angular/forms';
import { SpecialistCustomDefectsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

type CustomDefectForm = FormGroup<{
	defectName: FormControl<string | null>;
	defectNotes: FormControl<string | null>;
}>;

@Component({
	selector: 'app-test-custom-defects',
	templateUrl: './custom-defects.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ButtonComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		DefaultNullOrEmpty,
	],
	styleUrls: ['./custom-defects.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDefectsComponent implements OnInit {
	fb = inject(FormBuilder);
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);
	destroyRef = inject(DestroyRef);

	mode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	// The test result holds the custom defects as a single value, so each defect is edited in a form array of its own
	customDefectsForm = this.fb.array<CustomDefectForm>([]);

	readonly FormNodeWidth = FormNodeWidth;

	ngOnInit(): void {
		if (!this.isEditing()) return;

		const customDefects = this.form.controls.testTypes.at(0).controls.customDefects;
		for (const customDefect of customDefects.value ?? []) {
			this.customDefectsForm.push(this.createCustomDefectForm(customDefect));
		}

		this.customDefectsForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
			customDefects.setValue(this.customDefectsForm.getRawValue() as SpecialistCustomDefectsSchema[]);
		});

		// Touching the test result (e.g. on review) also touches the custom defects, so their inline errors display
		customDefects.events
			.pipe(
				filter((event) => event instanceof TouchedChangeEvent && event.touched),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.customDefectsForm.markAllAsTouched());

		customDefects.setValidators([
			this.commonValidators.applyWhen(
				() => this.isSpecialistGroup1(),
				() => this.getFirstCustomDefectError()
			),
		]);
	}

	createCustomDefectForm(customDefect?: SpecialistCustomDefectsSchema): CustomDefectForm {
		return this.fb.group({
			defectName: this.fb.control<string | null>(customDefect?.defectName ?? null, [
				this.commonValidators.required('Defect Name'),
				this.commonValidators.maxLength(200, 'Defect Name'),
			]),
			defectNotes: this.fb.control<string | null>(customDefect?.defectNotes ?? null, [
				this.commonValidators.required('Defect Notes'),
				this.commonValidators.maxLength(500, 'Defect Notes'),
			]),
		});
	}

	getFirstCustomDefectError(): ValidationErrors | null {
		for (const [index, customDefect] of this.customDefectsForm.controls.entries()) {
			for (const [key, control] of Object.entries(customDefect.controls)) {
				// The common validators skip controls without a parent, so a newly added defect is only valid until revalidated
				control.updateValueAndValidity({ onlySelf: true, emitEvent: false });

				const [errorKey, error] = Object.entries(control.errors ?? {})[0] ?? [];
				if (errorKey) {
					return { [errorKey]: { ...(error as GlobalError), anchorLink: `${key}-${index}` } };
				}
			}
		}

		return null;
	}

	isEditing(): boolean {
		return this.mode() === Modes.EDIT || this.mode() === Modes.AMEND;
	}

	isSpecialistGroup1(): boolean {
		return TEST_TYPES_GROUP1_SPEC_TEST.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	onAddCustomDefect(): void {
		this.customDefectsForm.push(this.createCustomDefectForm());
	}

	onRemoveCustomDefect(index: number): void {
		this.customDefectsForm.removeAt(index);
	}

	get customDefects(): SpecialistCustomDefectsSchema[] {
		return this.testResult()?.testTypes[0].customDefects ?? [];
	}

	protected readonly Modes = Modes;
}
