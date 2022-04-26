import { Component } from '@angular/core';
import { GlobalError, GlobalErrorService } from './global-error.service';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent {
  constructor(public globalErrorService: GlobalErrorService) {}

  goto(error: GlobalError) {
    const el = document.getElementById(error.anchorLink);
    el && el.focus({ preventScroll: false });
  }
}
