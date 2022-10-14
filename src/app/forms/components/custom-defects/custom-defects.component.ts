import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomDefect, CustomDefects } from '@api/test-results';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { throws } from 'assert';
import { Subject, debounceTime, takeUntil, Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-defects',
  templateUrl: './custom-defects.component.html'
})
export class CustomDefectsComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: Partial<TestResultModel> = {};

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();
  private _defectsForm?: CustomFormArray;

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => {
      this.formChange.emit(event);
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get customDefectsForm(): CustomFormArray {
    if (!this._defectsForm) {
      this._defectsForm = this.form?.get(['testTypes', '0', 'customDefects']) as CustomFormArray;
    }
    return this._defectsForm;
  }

  get defectCount(): number {
    return this.customDefectsForm?.controls.length;
  }

  get customDefects(): CustomDefects {
    return this.customDefectsForm.controls.map(control => {
      const formGroup = control as CustomFormGroup;
      return formGroup.getCleanValue(formGroup) as CustomDefect;
    });
  }

  handleAddDefect(): void {
    this.customDefectsForm.addControl();
  }
}
