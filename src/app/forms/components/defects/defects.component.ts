import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-defects[template]',
  templateUrl: './defects.component.html'
})
export class DefectsComponent implements OnInit {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: any = {};

  @Output() formsChange = new EventEmitter<(CustomFormGroup | CustomFormArray)[]>();
  form!: CustomFormGroup;

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
  }

  get defectsForm() {
    return this.form?.get(['testTypes', '0', 'defects']) as CustomFormArray;
  }

  getDefectForm(i: number) {
    return this.defectsForm?.controls[i] as CustomFormGroup;
  }

  trackByFn(index: number, defect: AbstractControl): number {
    return index;
  }

  get defectCount() {
    return this.defectsForm?.controls.length;
  }
}
