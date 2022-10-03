import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { Axle, TechRecordModel } from '@models/vehicle-tech-record.model';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-weights',
  templateUrl: './weights.component.html'
})
export class WeightsComponent implements OnInit, OnDestroy {
  @Input() isEditable = false;
  @Input() template: FormNode | undefined;
  @Input() data: Partial<TechRecordModel> = {};

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template!, this.data) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => {
      this.formChange.emit(event);
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get axles(): Axle[] | undefined {
    return this.data.axles;
  }

  get axlesFormArray() {
    return this.form.get(['axles']) as FormArray;
  }
}
