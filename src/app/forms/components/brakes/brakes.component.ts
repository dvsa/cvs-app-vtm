import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { TrlBrakes } from '@forms/templates/trl/trl-brakes.template';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-brakes[vehicleTechRecord]',
  templateUrl: './brakes.component.html',
  styleUrls: ['./brakes.component.scss']
})
export class BrakesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  template!: FormNode;

  booleanOptions: MultiOptions = [{ value: true, label: 'Yes' }, { value: false, label: 'No' }];

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.template = TrlBrakes;

    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;

    this.form.cleanValueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(e => this.formChange.emit(e));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { data } =  changes;

    if (data?.currentValue && data.currentValue !== data.previousValue) {
      this.form.patchValue(data.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get axles(): FormArray {
    return this.form.get(['axles']) as FormArray;
  }

  pascalCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
}
