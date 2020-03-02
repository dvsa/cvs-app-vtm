import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestType} from '@app/models/test.type';
import {VIEW_STATE} from '@app/app.enums';

@Component({
  selector: 'vtm-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {

  @Input() testType: TestType;
  @Input() editState: VIEW_STATE;

  constructor() { }

  ngOnInit() {
  }

}
