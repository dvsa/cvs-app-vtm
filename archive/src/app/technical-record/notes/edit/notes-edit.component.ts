import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

@Component({
  selector: 'vtm-notes-edit',
  templateUrl: './notes-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class NotesEditComponent implements OnInit {
  @Input() notesDetails: string;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const notes: string = !!this.notesDetails ? this.notesDetails : null;

    this.techRecordFg.addControl('notes', this.fb.control(notes));
  }
}
