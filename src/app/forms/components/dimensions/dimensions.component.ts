import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { getDimensionsSection } from '@forms/templates/general/dimensions.template';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dimensions',
  templateUrl: './dimensions.component.html',
  styleUrls: ['./dimensions.component.scss']
})
export class DimensionsComponent implements OnInit, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  template!: FormNode;

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.template = getDimensionsSection(
      this.vehicleTechRecord.vehicleType,
      this.vehicleTechRecord.noOfAxles,
      this.vehicleTechRecord.dimensions?.axleSpacing
    );

    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;

    this.form.cleanValueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(e => this.formChange.emit(e));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get frontAxleToRearAxle(): CustomFormControl {
    return this.form.get(['frontAxleToRearAxle']) as CustomFormControl;
  }

  get rearAxleToRearTrl(): CustomFormControl {
    return this.form.get(['rearAxleToRearTrl']) as CustomFormControl;
  }

  get axles(): FormNode[] | undefined {
    return (this.form.get(['dimensionsBottomSection', 'dimensions']) as CustomFormGroup)?.meta.children;
  }

  get dimensions(): CustomFormGroup {
    return this.form.get(['dimensions']) as CustomFormGroup;
  }

  getDimension(name: string): CustomFormControl {
    return this.dimensions.get(name) as CustomFormControl;
  }
}
