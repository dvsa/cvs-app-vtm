import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() {}
}
