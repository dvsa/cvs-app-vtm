import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html',
  styleUrls: ['./phase-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseBannerComponent implements OnInit {
  private count = 0;
  constructor() {}

  ngOnInit(): void {}

  get feedbackUri(): string {
    return environment.FEEDBACK_URI;
  }
}
