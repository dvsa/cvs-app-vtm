import { Component, ChangeDetectionStrategy } from '@angular/core';
import { initAll } from 'govuk-frontend';

@Component({
  selector: 'vtm-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor() {
    initAll();
  }
}
