import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, forwardRef, input, model, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
	selector: 'govuk-form-group-textarea',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, NoEmojisDirective, AsyncPipe],
	templateUrl: './govuk-form-group-textarea.component.html',
	styleUrls: ['./govuk-form-group-textarea.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupTextareaComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupTextareaComponent extends GovukFormGroupBaseComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | null | undefined>(null);

	// Debounce screen reader character count message to avoid spamming announcements
	screenReaderCharacterCountMessage = toObservable(this.value).pipe(
		distinctUntilChanged(),
		debounceTime(600),
		map(() => this.getCharacterCountMessage())
	);

	readonly maxLength = input<number | null>(null);

	writeValue(obj: any): void {
		this.value.set(obj);
		this.onChange(obj);
	}

	getCharacterCountMessage(): string {
		const max = this.maxLength();
		if (!max) return '';

		const length = this.value()?.length ?? 0;
		const diff = max - length;

		return diff >= 0
			? `You have ${diff} character${diff !== 1 ? 's' : ''} remaining`
			: `You have ${-diff} character${-diff !== 1 ? 's' : ''} too many`;
	}

	protected readonly FormNodeWidth = FormNodeWidth;
}
