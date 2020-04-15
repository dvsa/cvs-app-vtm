import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

import { TechRecord, Axle, Tyres } from '@app/models/tech-record.model';
import { SelectOption } from '@app/models/select-option';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { FITMENT_CODE } from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-tyres-edit',
  templateUrl: './tyres-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TyresEditComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  techAxles: Axle[];
  fitmentCodeOptions: SelectOption[];

  get axleCtrls() {
    return this.techRecordFg.get('axles') as FormArray;
  }

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.fitmentCodeOptions = new DisplayOptionsPipe().transform(FITMENT_CODE);

    const { axles } = this.techRecord;
    this.techAxles = axles && axles.length ? axles : [];

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl('tyreUseCode', this.fb.control(this.techRecord.tyreUseCode));
    this.buildAxleTyresGroup(this.techAxles);
  }

  buildAxleTyresGroup(axles: Axle[]): void {
    axles.map((axle: Axle, index: number) => {
      const tyresGroup: FormGroup = this.buildTyreGroup(axle.tyres ? axle.tyres : ({} as Tyres));
      this.addToAxleArrayGroup(index, tyresGroup);
    });
  }

  buildTyreGroup(tyres: Tyres): FormGroup {
    return this.fb.group({
      tyreCode: this.fb.control(tyres.tyreCode),
      tyreSize: this.fb.control(tyres.tyreSize),
      plyRating: this.fb.control(tyres.plyRating),
      fitmentCode: this.fb.control(tyres.fitmentCode),
      dataTrAxles: this.fb.control(tyres.dataTrAxles)
    });
  }

  addToAxleArrayGroup(position: number, weightsGroup: FormGroup): void {
    (this.axleCtrls.controls[position] as FormGroup).addControl('weights', weightsGroup);
  }
}

// TODO: Remove after CVSB-10619
// this.techAxles = [
//   {
//     tyres: {
//       tyreSize: 'string',
//       plyRating: 'string',
//       fitmentCode: '23',
//       dataTrAxles: 6,
//       tyreCode: 6
//     }
//   },
//   {
//     tyres: {
//       tyreSize: 'string',
//       plyRating: 'string',
//       fitmentCode: '23',
//       dataTrAxles: 35,
//       tyreCode: 23
//     }
//   }
// ] as Axle[];
