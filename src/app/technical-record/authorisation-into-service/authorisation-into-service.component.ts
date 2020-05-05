import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AuthoIntoService } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-authorisation-into-service',
  templateUrl: './authorisation-into-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorisationIntoServiceComponent implements OnInit {

  @Input() authoIntoService: AuthoIntoService;
  constructor() { }

  ngOnInit() {
  }

}
