import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-field-warning-message',
	templateUrl: './field-warning-message.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldWarningMessageComponent {
	@Input() warningMessage: string | undefined;
}
