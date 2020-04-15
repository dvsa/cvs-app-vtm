import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  FormBuilder,
  FormArray
} from '@angular/forms';

import { TechRecord, Axle, Weights } from '@app/models/tech-record.model';

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
export class WeightsEditComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  techAxles: Axle[];

  get axleCtrls() {
    return this.techRecordFg.get('axles') as FormArray;
  }

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    const { axles } = this.techRecord;
    this.techAxles = axles && axles.length ? axles : [];

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

    this.buildAxleWeightsGroup(this.techAxles);
  }

  buildAxleWeightsGroup(axles: Axle[]): void {
    axles.map((axle: Axle, index: number) => {
      const weightsGroup: FormGroup = this.buildWeightGroup(
        axle.weights ? axle.weights : ({} as Weights)
      );
      this.addToAxleArrayGroup(index, weightsGroup);
    });
  }

  buildWeightGroup(weights: Weights): FormGroup {
    return this.fb.group({
      gbWeight: this.fb.control(weights.gbWeight),
      eecWeight: this.fb.control(weights.eecWeight),
      designWeight: this.fb.control(weights.designWeight)
    });
  }

  addToAxleArrayGroup(position: number, weightsGroup: FormGroup): void {
    (this.axleCtrls.controls[position] as FormGroup).addControl('weights', weightsGroup);
  }
}

// TODO: Remove after CVSB-10619
// this.techAxles = [
//   {
//     weights: {
//       gbWeight: 0,
//       eecWeight: 0,
//       designWeight: 0
//     }
//   },
//   {
//     weights: {
//       gbWeight: 10,
//       eecWeight: 15,
//       designWeight: 20
//     }
//   }
// ] as Axle[];
