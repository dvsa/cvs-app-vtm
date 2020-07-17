import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { LettersOfAuth } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-letters-of-authorisation',
  templateUrl: './letters-of-authorisation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LettersOfAuthorisationComponent implements OnInit {
  @Input() lettersOfAuth: LettersOfAuth;
  constructor() {}

  ngOnInit() {}
}
