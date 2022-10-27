import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
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
    const { vehicleTechRecord } =  changes;

    if (vehicleTechRecord?.currentValue && vehicleTechRecord.currentValue !== vehicleTechRecord.previousValue) {
      this.form.patchValue(vehicleTechRecord.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get brakes(): FormGroup {
    return this.form.get(['brakes']) as FormGroup;
  }

  get axles(): FormArray {
    return this.form.get(['axles']) as FormArray;
  }

  getAxleBrakes(i: number): FormGroup {
    return this.form.get(['axles', i, 'brakes']) as FormGroup;
  }

  pascalCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase();
}
