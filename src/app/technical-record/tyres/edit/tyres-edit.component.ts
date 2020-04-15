import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { TechRecord, Axle, Tyres } from '@app/models/tech-record.model';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { FITMENT_CODE } from '@app/technical-record/technical-record.constants';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';

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
  fitmentCodeOptions = new DisplayOptionsPipe().transform(FITMENT_CODE);
  numberOfAxles$: Observable<number>;
  onDestroy$ = new Subject();

  get axlesTyres() {
    return this.techRecordFg.get('axlesTyres') as FormArray;
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
    this.techRecordFg.addControl('tyreUseCode', this.fb.control(this.techRecord.tyreUseCode));
    this.techRecordFg.addControl('axlesTyres', this.buildAxleArrayGroup(techAxles));

    this.handleFormChanges();
  }

  buildAxleArrayGroup(axles: Axle[]): FormArray {
    return this.fb.array(axles.map(this.buildAxleTyresGroup.bind(this)));
  }

  buildAxleTyresGroup(axle: Axle): FormGroup {
    const tyres: Tyres = axle.tyres ? axle.tyres : ({} as Tyres);

    return this.fb.group({
      axleNumber: this.fb.control(axle.axleNumber),
      tyres: this.fb.group({
        tyreCode: this.fb.control(tyres.tyreCode),
        tyreSize: this.fb.control(tyres.tyreSize),
        plyRating: this.fb.control(tyres.plyRating),
        fitmentCode: this.fb.control(tyres.fitmentCode),
        dataTrAxles: this.fb.control(tyres.dataTrAxles)
      })
    });
  }

  handleFormChanges() {
    this.numberOfAxles$
      .pipe(
        tap((numAxles) => {
          this.createAxleTyresGroupByNumberOfAxles(numAxles);
          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  private createAxleTyresGroupByNumberOfAxles(numOfAxles: number): void {
    const currentAxleTyresGroups = this.axlesTyres.controls.length;
    const numOfIterations: number = currentAxleTyresGroups - numOfAxles;

    numOfIterations < 0
      ? this.addAxleTyresGroupByIterations(numOfIterations)
      : this.removeAxleTyresGroupByIterations(numOfIterations);

    this.axlesTyres.markAsDirty();
  }

  private addAxleTyresGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index < 0; index++) {
      const axleTyresGroup = this.buildAxleTyresGroup({
        axleNumber: this.axlesTyres.controls.length + 1
      } as Axle);

      this.axlesTyres.push(axleTyresGroup);
    }
  }

  private removeAxleTyresGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index > 0; index--) {
      this.axlesTyres.removeAt(--this.axlesTyres.controls.length);
    }
  }
}
