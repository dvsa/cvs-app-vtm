
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { VIEW_STATE } from '@app/app.enums';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
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

  testResultChildForm: FormGroupDirective;
  testTypeGroup: FormGroup;

  constructor(parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;

    if (!!this.testTypeGroup) {
      this.testTypeGroup.addControl(
        'additionalNotesRecorded',
        new FormControl(this.testType.additionalNotesRecorded)
      );
    }
  }
}
