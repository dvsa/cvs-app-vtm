import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'app-abandon-dialog',
  templateUrl: './abandon-dialog.component.html',
  styleUrls: ['./abandon-dialog.component.scss']
})
export class AbandonDialogComponent extends BaseDialogComponent {
  private form!: CustomFormGroup;

  constructor() {
    super();
  }
}
