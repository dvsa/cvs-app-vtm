import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DefectAdditionalInformation } from '@api/test-results';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';

@Component({
  selector: 'app-defects[template]',
  templateUrl: './defects.component.html'
})
export class DefectsComponent implements OnInit {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: any = {};

  @Output() formChange = new EventEmitter<(CustomFormGroup | CustomFormArray)[]>();
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

  handleDefectSelection(selection: { defect: Defect, item: Item, deficiency: Deficiency }): void {
    //
    //
    //
    const testResultDefect: TestResultDefect = {
      imDescription: selection.defect.imDescription,
      imNumber: selection.defect.imNumber,

      itemDescription: selection.item.itemDescription,
      itemNumber: selection.item.itemNumber,

      deficiencyCategory: selection.deficiency.deficiencyCategory,
      deficiencyId: selection.deficiency.deficiencyId,
      deficiencySubId: selection.deficiency.deficiencySubId,
      deficiencyText: selection.deficiency.deficiencyText,
      deficiencyRef: selection.deficiency.ref,
      stdForProhibition: selection.deficiency.stdForProhibition
    };

    this.defectsForm.addControl(testResultDefect);
  }
}
