import { Component } from '@angular/core';
import { GlobalWarning } from './global-warning.interface';
import { GlobalWarningService } from './global-warning.service';

@Component({
  selector: 'app-global-warning',
  templateUrl: './global-warning.component.html',
})
export class GlobalWarningComponent {
  constructor(public globalWarningService: GlobalWarningService) {}

  goto(warning: GlobalWarning) {
    if (warning.anchorLink) {
      const el = document.getElementById(warning.anchorLink);
      el && el.focus({ preventScroll: false });
    }
  }
}
