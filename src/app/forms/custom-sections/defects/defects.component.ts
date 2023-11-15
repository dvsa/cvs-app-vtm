import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-defects[defects][template]',
  templateUrl: './defects.component.html',
})
export class DefectsComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() defects!: Defect[] | null;
  @Input() template!: FormNode;
  @Input() data: Partial<TestResultModel> = {};

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private formSubscription = new Subscription();
  private defectsFormArray?: CustomFormArray;

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => {
      this.formChange.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  get defectsForm(): CustomFormArray {
    if (!this.defectsFormArray) {
      this.defectsFormArray = this.form?.get(['testTypes', '0', 'defects']) as CustomFormArray;
    }
    return this.defectsFormArray;
  }

  get defectCount(): number {
    return this.defectsForm?.controls.length;
  }

  get testDefects(): TestResultDefect[] {
    return this.defectsForm.controls.map((control) => {
      const formGroup = control as CustomFormGroup;
      return formGroup.getCleanValue(formGroup) as TestResultDefect;
    });
  }

  categoryColor(category: CategoryColorKey): CategoryColor {
    return categoryColors[`${category}`];
  }
}

const categoryColors = {
  major: 'orange', minor: 'yellow', dangerous: 'red', advisory: 'blue',
} as const;

type CategoryColors = typeof categoryColors;
type CategoryColorKey = keyof CategoryColors;
type CategoryColor = CategoryColors[CategoryColorKey];
