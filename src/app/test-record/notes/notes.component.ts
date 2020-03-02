import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestType} from '@app/models/test.type';

@Component({
  selector: 'vtm-notes',
  templateUrl: './notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {

  @Input() testType: TestType;

  constructor() { }

  ngOnInit() {
  }

}
