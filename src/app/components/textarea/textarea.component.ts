import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SanitiseUnicodeDirective } from '../../directives/app-sanitise-unicode/app-sanitise-unicode.directive';
import { NoEmojisDirective } from '../../directives/no-emojis/no-emojis.directive';
import { CustomFormControlDirective } from '../custom-form-control/custom-form-control.directive';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-textarea',
	templateUrl: './textarea.component.html',
	styleUrls: ['./textarea.component.scss'],
	imports: [FormsModule, NoEmojisDirective, SanitiseUnicodeDirective, NgClass],
})
export class TextareaComponent extends CustomFormControlDirective<string | null> {
	readonly id = input<string>();
	readonly label = input<string>();
	readonly hint = input<string>();
	readonly showErrors = input<boolean>(true);
	readonly showGroupErrors = input<boolean>(false);
	readonly textareaClass = input<string>();
	readonly maxLength = input<number>();
	readonly length = computed(() => this.value()?.length ?? 0);
	readonly charactersRemaining = computed(() => {
		const maxLength = this.maxLength();
		if (!maxLength) return 0;

		const length = this.length();
		const diff = maxLength - length;
		return diff;
	});
	readonly characterCountMessage = computed(() => {
		const charactersRemaining = this.charactersRemaining();
		return charactersRemaining >= 0
			? `You have ${charactersRemaining} character${charactersRemaining !== 1 ? 's' : ''} remaining`
			: `You have ${-charactersRemaining} character${-charactersRemaining !== 1 ? 's' : ''} too many`;
	});
}
