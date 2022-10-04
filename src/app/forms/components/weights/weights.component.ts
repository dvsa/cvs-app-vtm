import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Axle, TechRecordModel } from '@models/vehicle-tech-record.model';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-weights[data][template][vehicleType]',
  templateUrl: './weights.component.html'
})
export class WeightsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isEditing = false;
  @Input() vehicleType!: string;
  @Input() template!: FormNode
  @Input() data!: Partial<TechRecordModel>;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => {
      this.formChange.emit(event);
    });
  }

  ngOnChanges() {
    this.form?.patchValue(this.data, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get axlesFormArray() {
    return this.form.get(['axles']) as FormArray;
  }
}
