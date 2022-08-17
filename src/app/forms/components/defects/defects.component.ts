import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-defects[template]',
  templateUrl: './defects.component.html'
})
export class DefectsComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: any = {};

  @Output() formsChange = new EventEmitter<(CustomFormGroup | CustomFormArray)[]>();
  form!: CustomFormGroup;

  private formSubscription = new Subscription();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this.formSubscription = this.form.valueChanges.subscribe(event => this.formsChange.emit(event));
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

  handleRemoveDefect(index: number): void {
    this.defectsForm.removeAt(index);
  }
}
