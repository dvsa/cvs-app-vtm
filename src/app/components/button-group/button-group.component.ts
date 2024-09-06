import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-button-group',
	templateUrl: './button-group.component.html',
	styleUrls: ['./button-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {}
