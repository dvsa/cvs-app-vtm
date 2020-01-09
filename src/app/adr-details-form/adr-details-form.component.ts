import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { createInitialState, IAppState, INITIAL_STATE } from '@app/adr-details-form/store/adrDetailsForm.state';
import { FormGroupState, AddArrayControlAction, RemoveArrayControlAction, SetValueAction, ResetAction } from 'ngrx-forms';
import { Observable, combineLatest, of } from 'rxjs';
import { adrDetailsFormModel } from '@app/adr-details-form/store/adrDetailsForm.model';
import { filter, catchError, map, withLatestFrom, take, tap } from 'rxjs/operators';
import {
  DownloadDocumentFileAction, CreateGuidanceNoteElementAction, CreatePermittedDangerousGoodElementAction, CreateTc3TypeElementAction,
  CreateTc3PeriodicNumberElementAction, CreateTc3PeriodicExpiryDateElementAction, AddTankDocumentAction, SetSubmittedValueAction, LoadAction
} from './store/adrDetails.actions';

@Component({
  selector: 'vtm-adr-details-form',
  templateUrl: './adr-details-form.component.html',
  styleUrls: ['./adr-details-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdrDetailsFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('fileInput') fileInputVariable: ElementRef;
  @Input() vehicletypes$: Observable<string[]>;
  @Input() permittedDangerousGoodsFe$: Observable<string[]>;
  @Input() guidanceNotesFe$: Observable<string[]>;
  @Input() initialAdrDetails: any;
  @Input() submitData: any;
  adrDetails$: Observable<any>;
  formState$: Observable<FormGroupState<adrDetailsFormModel>>;
  permittedDangerousGoodsOptions$: Observable<string[]>;
  additionalNotesOptions$: Observable<string[]>;
  productListUnNoOptions$: Observable<number[]>;
  tc3TypeOptions$: Observable<number[]>;
  tc3PeriodicNumberOptions$: Observable<number[]>;
  tc3PeriodicExpiryDateOptions$: Observable<{
    day: number;
    month: number;
    year: number;
  }[]>;
  tc3Inspections$: Observable<any[]>;
  downloadUrl: string;
  submittedValue$: Observable<adrDetailsFormModel | undefined>;
  isVehicleTankOrBattery$: Observable<boolean>;
  isPermittedExplosiveDangerousGoods$: Observable<boolean>;
  fileList: FileList;
  public files: Set<File> = new Set();
  isStatement: boolean;
  isBatteryApplicable: boolean;
  isBrakeDeclarationsSeen: boolean;
  isBrakeEndurance: boolean;

  constructor(private _store: Store<IAppState>) {
    this.adrDetails$ = this._store.select(s => s.adrDetails);
    this.formState$ = this._store.pipe(select(s => s.adrDetails.formState));
    this.permittedDangerousGoodsOptions$ = this._store.pipe(select(s => s.adrDetails.permittedDangerousGoodsOptions));
    this.productListUnNoOptions$ = this._store.pipe(
      filter(s => s.adrDetails.productListUnNo !== undefined),
      select(s => s.adrDetails.productListUnNo.options));
    this.tc3TypeOptions$ = this._store.pipe(
      filter(s => s.adrDetails.tc3Type !== undefined),
      select(s => s.adrDetails.tc3Type.options));
    this.tc3PeriodicNumberOptions$ = this._store.pipe(
      filter(s => s.adrDetails.tc3PeriodicNumber !== undefined),
      select(s => s.adrDetails.tc3PeriodicNumber.options));
    this.tc3PeriodicExpiryDateOptions$ = this._store.pipe(
      filter(s => s.adrDetails.tc3PeriodicExpiryDate !== undefined),
      select(s => s.adrDetails.tc3PeriodicExpiryDate.options));

    this.submittedValue$ = this._store.pipe(select(s => s.adrDetails.submittedValue));
    this.isVehicleTankOrBattery$ = this.formState$.pipe(
      map(formState => {
        if (this.isNullOrEmpty(formState.value.type)) {
          return false;
        }
        return formState.value.type.includes('battery') || formState.value.type.includes('tank');
      }),
      catchError(err => {
        return of(false);
      })
    );

    this.isPermittedExplosiveDangerousGoods$ = this.formState$.pipe(map(s =>
      s.value.permittedDangerousGoods['Explosives (type 2)'] || s.value.permittedDangerousGoods['Explosives (type 3)']),
      catchError(err => {
        return of(false);
      })
    );
    this.additionalNotesOptions$ = this._store.pipe(select(s => s.adrDetails.additionalNotesOptions));
    this.tc3Inspections$ = combineLatest(this.tc3TypeOptions$, this.tc3PeriodicNumberOptions$, this.tc3PeriodicExpiryDateOptions$).pipe(
      withLatestFrom(this.tc3PeriodicNumberOptions$, this.tc3PeriodicExpiryDateOptions$),
      filter(([type, periodicNumber, expiryDate]) => type !== undefined || periodicNumber !== undefined || expiryDate !== undefined),
      map(([type, periodicNumber, expiryDate]) => {
        return [{ type, periodicNumber, expiryDate }];
      })
    );
  }

  ngOnInit() {

    this._store.dispatch(new LoadAction({}));

    if (this.initialAdrDetails !== undefined) {
      console.log(`initialAdrDetails is => ${JSON.stringify(this.initialAdrDetails)}`);
      this._store.dispatch(new SetValueAction(INITIAL_STATE.id, createInitialState(this.initialAdrDetails)));
    }
    this.permittedDangerousGoodsFe$.subscribe(goods => {
      goods.forEach(good => {
        this._store.dispatch(new CreatePermittedDangerousGoodElementAction(good,
          this.initialAdrDetails && this.initialAdrDetails.permittedDangerousGoods.includes(good)));
      });
    });
    this.guidanceNotesFe$.subscribe(notes => {
      notes.forEach(note => {
        this._store.dispatch(new CreateGuidanceNoteElementAction(note,
          this.initialAdrDetails && this.initialAdrDetails.additionalNotes.guidanceNotes.includes(note)));
      });
    });


  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];

      let curVal = JSON.stringify(change.currentValue);
      let prevVal = JSON.stringify(change.previousValue);
      let changeLog = `${propName}: currentValue = ${curVal}, previousValue = ${prevVal}`;

      if (propName === 'submitData') {
        console.log(`detected change in submitData => ${changeLog}`);
      }
    }
  }

  ngOnDestroy(): void {
    this.reset();
    console.log(`called adr-details ngOnDestroy`);
  }

  reset() {
    this._store.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this._store.dispatch(new ResetAction(INITIAL_STATE.id));
  }

  downloadDocument(doc) {
    this._store.dispatch(new DownloadDocumentFileAction(doc));
  }



  addAddUNOption() {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.productListUnNo.id),
      map(id => new AddArrayControlAction(id, null, null)),
    ).subscribe(this._store);
  }

  removeUnoOption(index: number) {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.productListUnNo.id),
      map(id => new RemoveArrayControlAction(id, index)),
    ).subscribe(this._store);
  }

  addAGuidanceNote(note: string) {
    this._store.dispatch(new CreateGuidanceNoteElementAction(note, false));
  }

  addDangerousGood(good: string) {
    this._store.dispatch(new CreatePermittedDangerousGoodElementAction(good, false));
  }

  addSubsequentInspection() {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.tc3Type.id),
      map(id => new CreateTc3TypeElementAction(id, '1')),
    ).subscribe(this._store);

    this.formState$.pipe(
      take(1),
      map(s => s.controls.tc3PeriodicNumber.id),
      map(id => new CreateTc3PeriodicNumberElementAction(id, '')),
    ).subscribe(this._store);

    this.formState$.pipe(
      take(1),
      map(s => s.controls.tc3PeriodicExpiryDate.id),
      map(id => new CreateTc3PeriodicExpiryDateElementAction(id, {
        day: 1,
        month: 1,
        year: 1930
      })),
    ).subscribe(this._store);
  }

  public changeListener($event): void {
    this.readThis($event.target);
    this.fileInputVariable.nativeElement.value = '';
  }

  private readThis(inputValue: any): void {
    this.fileList = inputValue.files;
    let currentFileIndex = 0;
    let filenames = [];
    for (let index = 0; index < this.fileList.length; index++) {
      filenames.push(this.fileList[index].name);
    }

    if (this.fileList.length > 0) {
      for (let index = 0; index < this.fileList.length; index++) {
        const file: File = this.fileList[index];
        this.files.add(file);
        const tankDocReader: FileReader = new FileReader();
        tankDocReader.readAsDataURL(file);
        tankDocReader.onload = () => {
          this.formState$.pipe(
            take(1),
            map(s => s.controls.tankDocuments.id),
            map(id => new AddTankDocumentAction(id, filenames[currentFileIndex++].concat(';', tankDocReader.result))),
          ).subscribe(this._store);
        };
      }
    }

  }

  removeTankDocument(index: number) {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.tankDocuments.id),
      map(id => new RemoveArrayControlAction(id, index)),
    ).subscribe(this._store);
  }

  selectReferenceNumberChange($event) {
    this.isStatement = $event.currentTarget.value === 'isStatement';
  }


  onBatteryApplicableChange($event) {
    this.isBatteryApplicable = $event.currentTarget.value === 'applicable';
  }

  onManufactureBreakChange($event) {
    this.isBrakeDeclarationsSeen = $event.currentTarget.checked === true;
  }

  onBrakeEnduranceChange($event) {
    this.isBrakeEndurance = $event.currentTarget.checked === true;
  }

  public submit() {
    this.formState$.pipe(
      take(1),
      map(fs => new SetSubmittedValueAction(fs.value)),
    ).subscribe(this._store);
  }

  public isNullOrEmpty(str) {
    return (typeof str === 'string' || str == null) ? !str || !str.trim() : false;
  }

  public isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  trackByIndex(index: number) {
    return index;
  }

  trackById(_: number, id: string) {
    return id;
  }

  trackByFn(index, item) {
    return item.id;
  }
}
