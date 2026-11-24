import { ChangeDetectorRef, Component, DestroyRef, Injector, OnInit, inject, input, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, NgControl } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import { validationErrorMessage } from '@forms/utils/validation-error-message';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'govuk-form-group-base-component',
	template: '',
})
export class GovukFormGroupBaseComponent implements OnInit {
	protected readonly validationErrorMessage = validationErrorMessage;
	// Absent when the component is bound to a signal form field with [formField].
	controlContainer = inject(ControlContainer, { optional: true });
	private readonly injector = inject(Injector);
	cdr = inject(ChangeDetectorRef);
	commonValidators = inject(CommonValidatorsService);
	destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		this.watchFormEvents();
	}

	/**
	 * Touched and validity changes are applied to the control from outside this template (e.g.
	 * GlobalErrorService.markAllAsTouched when a form is submitted), so nothing tells Angular this
	 * view needs refreshing and the inline error never renders.
	 */
	protected watchFormEvents(): void {
		// A signal form field is read through signals, which refresh the view by themselves.
		if (this.formField) return;
		(this.control as AbstractControl | null | undefined)?.events
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => this.cdr.markForCheck());
	}

	readonly tags = input<CustomTag[]>([]);

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input<string>('', { alias: 'formControlName' });

	readonly controlLabel = input('', { alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	readonly isCreateMode = input(false);

	readonly controlTitle = input('', { alias: 'title' });

	readonly controlType = input('text', { alias: 'type' });

	disabled = model(false);

	readonly width = input<FormNodeWidth>();

	readonly prefix = input<string>();

	readonly warning = input<string | null>(null);

	onChange = (_: any) => {};
	onTouched = () => {};

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	private boundFormField?: FormField<unknown> | null;

	/**
	 * The signal form field bound with [formField]. It is looked up lazily, as the directive provides
	 * the value accessor this component implements and so cannot be injected while it is created.
	 */
	protected get formField(): FormField<unknown> | null {
		if (this.boundFormField === undefined) {
			this.boundFormField = this.injector.get(FormField, null, { self: true });
		}
		return this.boundFormField;
	}

	get control(): AbstractControl | NgControl | null | undefined {
		if (this.formField) return this.injector.get(NgControl, null, { self: true });
		return this.controlContainer?.control?.get(this.controlName());
	}

	get id() {
		return this.controlId() || this.controlName() || String(this.formField?.state().keyInParent() ?? '');
	}

	get hintId() {
		return `${this.id}-hint`;
	}

	get labelId() {
		return `${this.id}-label`;
	}

	get errorId() {
		return `${this.id}-error`;
	}

	get hasError() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}

	get hasWarning() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}
}
