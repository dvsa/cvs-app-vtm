import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AuthIntoService } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-authorisation-into-service',
  templateUrl: './authorisation-into-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorisationIntoServiceComponent implements OnInit {
  @Input() authIntoService: AuthIntoService;

  constructor() {}

  ngOnInit() {}
}
