import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-icon',
	templateUrl: './icon.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
	@Input() icon = '';
}
