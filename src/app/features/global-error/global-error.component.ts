import { Component, OnInit } from '@angular/core';
import { GlobalErrorService } from '@services/global-error/global-error.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent {

  errorMessage$: Observable<string | null>;

  constructor(private globalErrorService: GlobalErrorService) {
    this.errorMessage$ = this.globalErrorService.globalError || null;
  }

}
