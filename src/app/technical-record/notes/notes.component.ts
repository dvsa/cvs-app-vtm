import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-notes',
  templateUrl: './notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  @Input() editState: boolean;
  @Input() activeRecord: TechRecord;

  notes: string;

  constructor() {}

  ngOnInit() {
    this.notes = this.activeRecord.notes;
  }
}
