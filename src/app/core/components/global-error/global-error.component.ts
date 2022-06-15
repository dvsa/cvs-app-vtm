import { Component } from '@angular/core';
import { GlobalError } from './global-error.interface';
import { GlobalErrorService } from './global-error.service';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
})
export class GlobalErrorComponent {
  constructor(public globalErrorService: GlobalErrorService) {}

  goto(error: GlobalError) {
    if (error.anchorLink) {
      const el = document.getElementById(error.anchorLink);
      el && el.focus({ preventScroll: false });
    }
  }
}
