import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-notes',
  templateUrl: './notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnChanges {
  @Input() techRecord: TechRecord;
  @Input() editState: boolean;

  notes: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (techRecord) {
      this.notes = this.techRecord.notes;
    }
  }
}
