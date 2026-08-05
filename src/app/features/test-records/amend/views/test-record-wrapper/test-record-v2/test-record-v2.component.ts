import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-test-record-v2',
	templateUrl: './test-record-v2.component.html',
	styleUrls: ['./test-record-v2.component.scss'],
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRecordV2Component {}
