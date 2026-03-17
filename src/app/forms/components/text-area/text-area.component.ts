import { AsyncPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { ValidatorNames } from '@models/validators.enum';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-text-area',
	templateUrl: './text-area.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: TextAreaComponent,
			multi: true,
		},
	],
	imports: [TagComponent, FieldErrorMessageComponent, FormsModule, NgClass, NoEmojisDirective, AsyncPipe],
})
export class TextAreaComponent extends BaseControlComponent {
	// Debounce screen reader character count message to avoid spamming announcements
	valueSub = new Subject<string | null | undefined>();
	screenReaderCharacterCountMessage = this.valueSub.pipe(
		distinctUntilChanged(),
		debounceTime(600),
		map(() => this.getCharacterCountMessage())
	);

	get maxLength(): number | undefined {
		return this.control?.meta.validators?.find((v) => v.name === ValidatorNames.MaxLength)?.args as number | undefined;
	}

	getCharacterCountMessage(): string {
		const max = this.maxLength;
		if (!max) return '';

		const length = this.value?.length ?? 0;
		const diff = max - length;

		return diff >= 0
			? `You have ${diff} character${diff !== 1 ? 's' : ''} remaining`
			: `You have ${-diff} character${-diff !== 1 ? 's' : ''} too many`;
	}
}
