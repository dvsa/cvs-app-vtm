import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-defects[defects][template]',
  templateUrl: './defects.component.html'
})
export class DefectsComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() defects!: Defect[] | null;
  @Input() template!: FormNode;
  @Input() data: any = {};

  @Output() formChange = new EventEmitter();
  form!: CustomFormGroup;

  private formSubscription = new Subscription();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.subscribe(event => {
      this.formChange.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  get defectsForm() {
    return this.form?.get(['testTypes', '0', 'defects']) as CustomFormArray;
  }

  getDefectForm(i: number) {
    return this.defectsForm?.controls[i] as CustomFormGroup;
  }

  trackByFn(index: number): number {
    return index;
  }

  get defectCount() {
    return this.defectsForm?.controls.length;
  }

  handleDefectSelection(selection: { defect: Defect; item: Item; deficiency: Deficiency }): void {
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

  handleRemoveDefect(index: number): void {
    this.defectsForm.removeAt(index);
  }
}
