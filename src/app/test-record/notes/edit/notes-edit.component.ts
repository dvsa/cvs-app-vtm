import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { VIEW_STATE } from '@app/app.enums';
import { ControlContainer, FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';
import { TestType } from '@app/models/test.type';

@Component({
  selector: 'vtm-notes-edit',
  templateUrl: './notes-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NotesEditComponent implements OnInit {
  @Input() currentState: VIEW_STATE;
  @Input() testType: TestType;
  @Input() isSubmitted: boolean;

  testTypeGroup: FormGroup;

  constructor(private parentForm: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.testTypeGroup = this.parentForm.form.get('testType') as FormGroup;

    this.testTypeGroup.addControl(
      'additionalNotesRecorded',
      this.fb.control(this.testType.additionalNotesRecorded)
    );
  }
}
