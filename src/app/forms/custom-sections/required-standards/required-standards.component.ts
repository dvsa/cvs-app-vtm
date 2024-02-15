import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-required-standards[template]',
  templateUrl: './required-standards.component.html',
})
export class RequiredStandardsComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() requiredStandards?: any[] | null = []; // TODO: fix this to use actual RS
  @Input() data: Partial<TestResultModel> = {};

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private formSubscription = new Subscription();
  private requiredStandardsFormArray?: CustomFormArray;

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

  get requiredStandardsForm(): CustomFormArray {
    if (!this.requiredStandardsFormArray) {
      this.requiredStandardsFormArray = this.form?.get(['testTypes', '0', 'requiredStandards']) as CustomFormArray;
    }
    return this.requiredStandardsFormArray;
  }

  get requiredStandardsCount(): number {
    return this.requiredStandardsForm?.controls.length;
  }

  get testRequiredStandards(): TestResultRequiredStandard[] {
    return this.requiredStandardsForm.controls.map((control) => {
      const formGroup = control as CustomFormGroup;
      return formGroup.getCleanValue(formGroup) as TestResultRequiredStandard;
    });
  }
}
