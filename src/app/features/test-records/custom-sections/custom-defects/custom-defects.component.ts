import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService, customDefectFieldError } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, DestroyRef, Injector, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, TouchedChangeEvent } from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { SpecialistCustomDefectsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

type CustomDefectForm = FormGroup<{
	defectName: SignalFormControl<string | null>;
	defectNotes: SignalFormControl<string | null>;
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
	destroyRef = inject(DestroyRef);
	private readonly injector = inject(Injector);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	readonly customDefects = computed<SpecialistCustomDefectsSchema[]>(
		() => this.testResult()?.testTypes[0].customDefects ?? []
	);

	// The test result holds the custom defects as a single value, so each defect is edited in a form array of its own
	customDefectsForm = this.fb.array<CustomDefectForm>([]);

	readonly FormNodeWidth = FormNodeWidth;

	ngOnInit(): void {
		if (!this.testService.isEditing()) return;

		const customDefects = this.form.controls.testTypes.at(0).controls.customDefects;
		for (const customDefect of customDefects.value ?? []) {
			this.addCustomDefectForm(customDefect);
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
	}

	createCustomDefectForm(customDefect?: SpecialistCustomDefectsSchema): CustomDefectForm {
		return new FormGroup({
			defectName: new SignalFormControl<string | null>(
				customDefect?.defectName ?? null,
				(path) => validate(path, ({ value }) => customDefectFieldError(value(), 'Defect Name', 200)),
				{ injector: this.injector }
			),
			defectNotes: new SignalFormControl<string | null>(
				customDefect?.defectNotes ?? null,
				(path) => validate(path, ({ value }) => customDefectFieldError(value(), 'Defect Notes', 500)),
				{ injector: this.injector }
			),
		});
	}

	onAddCustomDefect(): void {
		this.addCustomDefectForm();
	}

	addCustomDefectForm(customDefect?: SpecialistCustomDefectsSchema): void {
		const customDefectForm = this.createCustomDefectForm(customDefect);
		this.customDefectsForm.push(customDefectForm);

		// Touched events only fire on the first touch, so reset it for the next review to touch the new defect too
		this.form.controls.testTypes.at(0).controls.customDefects.markAsUntouched();
	}

	onRemoveCustomDefect(index: number): void {
		this.customDefectsForm.removeAt(index);
	}
}
