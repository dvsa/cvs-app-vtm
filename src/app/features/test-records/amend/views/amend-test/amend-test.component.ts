import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-amend-test',
	templateUrl: './amend-test.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmendTestComponent {}
