import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { TechRecord, Dimensions, AxleSpacing } from '@app/models/tech-record.model';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { VEHICLE_TYPES } from '@app/app.enums';

@Component({
  selector: 'vtm-dimensions-edit',
  templateUrl: './dimensions-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsEditComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  numberOfAxles$: Observable<number>;
  onDestroy$ = new Subject();
  isHgvVehicle: boolean;

  get axleSpacing() {
    const dimensionsFg = this.techRecordFg.get('dimensions') as FormGroup;
    return dimensionsFg.get('axleSpacing') as FormArray;
  }

  constructor(
    private parent: FormGroupDirective,
    private fb: FormBuilder,
    private techRecHelper: TechRecordHelperService,
    private detectChange: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.numberOfAxles$ = this.techRecHelper.getNumberOfAxles();
    this.isHgvVehicle = this.techRecord.vehicleType === VEHICLE_TYPES.HGV;

    const dimensions: Dimensions = this.techRecord.dimensions
      ? this.techRecord.dimensions
      : ({} as Dimensions);

    const axleSpacing = dimensions.axleSpacing ? dimensions.axleSpacing : ([] as AxleSpacing[]);

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl(
      'dimensions',
      this.fb.group({
        length: this.fb.control(dimensions.length),
        width: this.fb.control(dimensions.width),
        axleSpacing: this.buildAxleSpacingArray(axleSpacing)
      })
    );
    this.techRecordFg.addControl(
      'frontAxleToRearAxle',
      this.fb.control(this.techRecord.frontAxleToRearAxle)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelCouplingMin',
      this.fb.control(this.techRecord.frontAxleTo5thWheelCouplingMin)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelCouplingMax',
      this.fb.control(this.techRecord.frontAxleTo5thWheelCouplingMax)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelMin',
      this.fb.control(this.techRecord.frontAxleTo5thWheelMin)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelMax',
      this.fb.control(this.techRecord.frontAxleTo5thWheelMax)
    );

    this.handleFormChanges();
  }

  buildAxleSpacingArray(axleSpacing: AxleSpacing[]): FormArray {
    return this.fb.array(axleSpacing.map(this.buildAxleSpacingGroup.bind(this)));
  }

  buildAxleSpacingGroup(spacing: AxleSpacing): FormGroup {
    const { axles, value } = spacing;
    const [from, to] = spacing.axles.split('-');

    return this.fb.group({ axles, from, to, value });
  }

  handleFormChanges() {
    this.numberOfAxles$
      .pipe(
        tap((numAxles) => {
          this.createAxleSpacingGroupByNumberOfAxles(numAxles);
          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  private createAxleSpacingGroupByNumberOfAxles(numOfAxles: number): void {
    const numOfIterations: number =
      numOfAxles === 1 && this.axleSpacing.controls.length === 1
        ? numOfAxles
        : this.axleSpacing.controls.length - (numOfAxles - 1);

    numOfIterations < 0
      ? this.addAxleSpacingGroupByIterations(numOfIterations)
      : this.removeAxleSpacingGroupByIterations(numOfIterations);

    if (numOfAxles > 1) {
      this.axleSpacing.markAsDirty();
    }
  }

  private addAxleSpacingGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index < 0; index++) {
      const latestPosition = this.axleSpacing.controls.length - 1;
      const latestSpacing: string = this.axleSpacing.controls[latestPosition]
        ? this.axleSpacing.controls[latestPosition].get('axles').value
        : '';
      const [from, to] = latestSpacing
        ? latestSpacing.split('-').map((axle) => +axle + 1)
        : ['1', '2'];
      const axleSpacingGroup = this.buildAxleSpacingGroup({
        axles: `${from}-${to}`,
        value: null
      } as AxleSpacing);

      this.axleSpacing.push(axleSpacingGroup);
    }
  }

  private removeAxleSpacingGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index > 0; index--) {
      this.axleSpacing.removeAt(--this.axleSpacing.controls.length);
    }
  }
}
