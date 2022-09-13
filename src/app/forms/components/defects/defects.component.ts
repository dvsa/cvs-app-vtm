import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-defects[defects][template]',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.scss']
})
export class DefectsComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() defects!: Defect[] | null;
  @Input() template!: FormNode;
  @Input() data: Partial<TestResultModel> = {};

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();
  private _defectsForm?: CustomFormArray;

  constructor(private dfs: DynamicFormService, private resultService: ResultOfTestService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => {
      this.formChange.emit(event);
      this.resultService.updateResultOfTest();
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get defectsForm(): CustomFormArray {
    if (!this._defectsForm) {
      this._defectsForm = this.form?.get(['testTypes', '0', 'defects']) as CustomFormArray;
    }
    return this._defectsForm;
  }

  get defectCount(): number {
    return this.defectsForm?.controls.length;
  }

  get testDefects(): TestResultDefect[] {
    let defectArray: TestResultDefect[] = [];

    for (let i = 0; i < this.defectCount; i++) {
      const data = this.defectsForm.controls[i] as CustomFormGroup;
      const defect = data.getCleanValue(data) as TestResultDefect;
      defectArray = [...defectArray, defect];
    }
    return defectArray;
  }

  categoryColor(category: string): 'red' | 'orange' | 'yellow' | 'green' | 'blue' {
    return (<Record<string, 'red' | 'orange' | 'green' | 'yellow' | 'blue'>>{ major: 'orange', minor: 'yellow', dangerous: 'red', advisory: 'blue' })[
      category
    ];
  }

  handleDefectSelection(selection: { defect: Defect; item: Item; deficiency?: Deficiency }): void {
    const testResultDefect: TestResultDefect = {
      imDescription: selection.defect.imDescription,
      imNumber: selection.defect.imNumber,

      itemDescription: selection.item.itemDescription,
      itemNumber: selection.item.itemNumber,

      deficiencyCategory: TestResultDefect.DeficiencyCategoryEnum.Advisory,
      deficiencyRef: `${selection.defect.imNumber}.${selection.item.itemNumber}`
    };

    if (selection.deficiency) {
      testResultDefect.deficiencyCategory = selection.deficiency.deficiencyCategory;
      testResultDefect.deficiencyId = selection.deficiency.deficiencyId;
      testResultDefect.deficiencySubId = selection.deficiency.deficiencySubId;
      testResultDefect.deficiencyText = selection.deficiency.deficiencyText;
      testResultDefect.deficiencyRef = selection.deficiency.ref;
      testResultDefect.stdForProhibition = selection.deficiency.stdForProhibition;
    }

    this.defectsForm.addControl(testResultDefect);
  }
}
