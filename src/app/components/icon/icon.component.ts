import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-icon',
	templateUrl: './icon.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
})
export class IconComponent {
	readonly icon = input('');
}
