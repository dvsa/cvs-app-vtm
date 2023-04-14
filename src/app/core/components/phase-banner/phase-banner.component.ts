import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../../environments/environment.deploy';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html',
  styleUrls: ['./phase-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseBannerComponent {
  private count = 0;
  constructor() {}

  get feedbackUri(): string {
    return environment.FEEDBACK_URI;
  }
}
