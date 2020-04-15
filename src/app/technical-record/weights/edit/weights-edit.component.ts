import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { TechRecord, Axle, Weights } from '@app/models/tech-record.model';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'vtm-weights-edit',
  templateUrl: './weights-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class WeightsEditComponent implements OnInit, OnDestroy {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  numberOfAxles$: Observable<number>;
  onDestroy$ = new Subject();

  get axlesWeigths() {
    return this.techRecordFg.get('axlesWeights') as FormArray;
  }

  constructor(
    private parent: FormGroupDirective,
    private fb: FormBuilder,
    private techRecHelper: TechRecordHelperService,
    private detectChange: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.numberOfAxles$ = this.techRecHelper.getNumberOfAxles();

    const { axles } = this.techRecord;
    const techAxles = axles && axles.length ? axles : [];

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl('grossGbWeight', this.fb.control(this.techRecord.grossGbWeight));
    this.techRecordFg.addControl(
      'grossEecWeight',
      this.fb.control(this.techRecord.grossEecWeight)
    );
    this.techRecordFg.addControl(
      'grossDesignWeight',
      this.fb.control(this.techRecord.grossDesignWeight)
    );

    this.techRecordFg.addControl('trainGbWeight', this.fb.control(this.techRecord.trainGbWeight));
    this.techRecordFg.addControl(
      'trainEecWeight',
      this.fb.control(this.techRecord.trainEecWeight)
    );
    this.techRecordFg.addControl(
      'trainDesignWeight',
      this.fb.control(this.techRecord.trainDesignWeight)
    );

    this.techRecordFg.addControl(
      'maxTrainGbWeight',
      this.fb.control(this.techRecord.maxTrainGbWeight)
    );
    this.techRecordFg.addControl(
      'maxTrainEecWeight',
      this.fb.control(this.techRecord.maxTrainEecWeight)
    );
    this.techRecordFg.addControl(
      'maxTrainDesignWeight',
      this.fb.control(this.techRecord.maxTrainDesignWeight)
    );

    this.techRecordFg.addControl('axlesWeights', this.buildAxleArrayGroup(techAxles));

    this.handleFormChanges();
  }

  buildAxleArrayGroup(axles: Axle[]): FormArray {
    return this.fb.array(axles.map(this.buildAxleWeightsGroup.bind(this)));
  }

  buildAxleWeightsGroup(axle: Axle): FormGroup {
    const weights = axle.weights ? axle.weights : ({} as Weights);

    return this.fb.group({
      axleNumber: this.fb.control(axle.axleNumber),
      weights: this.fb.group({
        gbWeight: this.fb.control(weights.gbWeight),
        eecWeight: this.fb.control(weights.eecWeight),
        designWeight: this.fb.control(weights.designWeight)
      })
    });
  }

  handleFormChanges() {
    this.numberOfAxles$
      .pipe(
        tap((numAxles) => {
          this.createAxleWeightsGroupByNumberOfAxles(numAxles), this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  private createAxleWeightsGroupByNumberOfAxles(numOfAxles: number): void {
    const numOfIterations: number = this.axlesWeigths.controls.length - numOfAxles;

    numOfIterations < 0
      ? this.addAxleWeightsGroupByIterations(numOfIterations)
      : this.removeAxleWeightsGroupByIterations(numOfIterations);

    this.axlesWeigths.markAsDirty();
  }

  private addAxleWeightsGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index < 0; index++) {
      const axleWeightsGroup = this.buildAxleWeightsGroup({
        axleNumber: this.axlesWeigths.controls.length + 1
      } as Axle);

      this.axlesWeigths.push(axleWeightsGroup);
    }
  }

  private removeAxleWeightsGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index > 0; index--) {
      this.axlesWeigths.removeAt(--this.axlesWeigths.controls.length);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
