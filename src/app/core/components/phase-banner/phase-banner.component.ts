import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-phase-banner',
	templateUrl: './phase-banner.component.html',
	styleUrls: ['./phase-banner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBannerComponent {
	get feedbackUri(): string {
		return environment.FEEDBACK_URI;
	}
}
