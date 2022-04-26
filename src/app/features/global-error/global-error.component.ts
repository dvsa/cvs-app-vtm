import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalError, GlobalErrorService } from './global-error.service';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent {
  constructor(public globalErrorService: GlobalErrorService, private router: Router) {}

  goto(error: GlobalError) {
    error.anchorLink && this.router.navigate([], { fragment: error.anchorLink });
    const el = document.getElementById(error.anchorLink);
    el && el.focus({ preventScroll: false });
  }
}
