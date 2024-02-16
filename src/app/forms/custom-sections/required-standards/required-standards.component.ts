import { ViewportScroller } from '@angular/common';
import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
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
  @Input() data: Partial<TestResultModel> = {};

  @Output() formChange = new EventEmitter();
  @Output() validateEuVehicleCategory = new EventEmitter();

  public form!: CustomFormGroup;
  private formSubscription = new Subscription();
  private requiredStandardsFormArray?: CustomFormArray;

  constructor(
    private dfs: DynamicFormService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private globalErrorService: GlobalErrorService,
  ) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => {
      this.formChange.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  onAddRequiredStandard(): void {
    this.globalErrorService.clearErrors();
    if (!this.data?.euVehicleCategory) {
      this.validateEuVehicleCategory.emit();
      this.viewportScroller.scrollToPosition([0, 0]);
      return;
    }
    void this.router.navigate(['selectRequiredStandard'], { queryParamsHandling: 'preserve', relativeTo: this.route });
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
