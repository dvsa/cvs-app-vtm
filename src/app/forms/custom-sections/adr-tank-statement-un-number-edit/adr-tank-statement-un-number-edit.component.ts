import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

import { FieldErrorMessageComponent } from '../../components/field-error-message/field-error-message.component';
import { TextInputComponent } from '../../components/text-input/text-input.component';

@Component({
	selector: 'app-adr-tank-statement-un-number',
	templateUrl: './adr-tank-statement-un-number-edit.component.html',
	styleUrls: ['./adr-tank-statement-un-number-edit.component.scss'],
	imports: [FieldErrorMessageComponent, TextInputComponent, FormsModule, ReactiveFormsModule],
})
export class AdrTankStatementUnNumberEditComponent extends CustomFormControlComponent implements OnDestroy {
	fb = inject(FormBuilder);

	destroy$ = new Subject();
	formArray = this.fb.array<CustomFormControl>([]);

	onFormArrayChange = this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
		this.control?.patchValue(changes, { emitModelToViewChange: true });
	});

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	override ngAfterContentInit(): void {
		super.ngAfterContentInit();
		this.buildFormArray();
	}

	buildFormArray() {
		const values: string[] = this.control?.value ?? [''];
		values.forEach((value) => this.addControl(value));
	}

	addControl(value = '') {
		const lastUnNumber = this.formArray.at(-1);

		if (this.formArray.length > 0 && (lastUnNumber.invalid || !lastUnNumber.value)) {
			// If the parent control or lastUnNumber control isn't already invalid set additional errors
			if (!this.control?.invalid && !lastUnNumber.invalid) {
				lastUnNumber.setErrors({ required: true });
			}

			// Mark as touched to show errors
			this.formArray.markAllAsTouched();

			return;
		}

		this.formArray.push(
			new CustomFormControl({ type: FormNodeTypes.CONTROL, name: 'UN number' }, value, [
				Validators.minLength(1),
				Validators.maxLength(1500),
			])
		);
	}

	removeControl(index: number) {
		this.formArray.removeAt(index);
	}
}
