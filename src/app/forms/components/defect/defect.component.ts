import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CustomFormArray, CustomFormGroup, FormNodeOption } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { select, Store } from '@ngrx/store';
import { createDefect, removeDefect, saveDefect, selectedTestResultState, TestResultsState, toEditOrNotToEdit } from '@store/test-records';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { filter, Subject, Subscription, takeUntil, debounceTime, take, withLatestFrom } from 'rxjs';
import { Defect } from '@models/defects/defect.model';
import { AdditionalInfoSection } from '@models/defects/additional-information.model';
import { KeyValue } from '@angular/common';
import { DefectAdditionalInformationLocation } from '@models/test-results/defectAdditionalInformationLocation';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DefectsState, filteredDefects, selectByDeficiencyRef, selectByImNumber } from '@store/defects';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { DefectsTpl } from '@forms/templates/general/defect.template';
import { selectRouteParam } from '@store/router/selectors/router.selectors';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  providers: [DefaultNullOrEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectComponent implements OnInit, OnDestroy {
  form!: CustomFormGroup;
  index!: number;
  isEditing: boolean;
  includeNotes = false;
  vehicleType!: VehicleTypes;

  private _defectsForm?: CustomFormArray;
  defects?: TestResultDefects;
  defect?: TestResultDefect;

  infoDictionary: Record<string, Array<FormNodeOption<any>>> = {};
  onDestroy$ = new Subject();

  booleanOptions: FormNodeOption<string | number | boolean>[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private defectsStore: Store<DefectsState>,
    private dfs: DynamicFormService,
    private pipe: DefaultNullOrEmpty,
    private router: Router,
    private testResultsStore: Store<TestResultsState>,
    private resultService: ResultOfTestService,
    private errorService: GlobalErrorService
  ) {
    this.isEditing = this.activatedRoute.snapshot.data['isEditing'];
  }

  ngOnInit(): void {
    const defectIndex = this.testResultsStore.pipe(select(selectRouteParam('defectIndex')));
    const defectRef = this.testResultsStore.pipe(select(selectRouteParam('ref')));

    this.testResultsStore
      .select(toEditOrNotToEdit)
      .pipe(
        withLatestFrom(defectIndex, defectRef),
        takeUntil(this.onDestroy$),
        filter(([testResult]) => !!testResult)
      )
      .subscribe(([testResult, defectIndex, defectRef]) => {
        this.defects = testResult!.testTypes[0].defects;
        this.vehicleType = testResult!.vehicleType;
        this._defectsForm = (this.dfs.createForm(DefectsTpl, testResult) as CustomFormGroup).get(['testTypes', '0', 'defects']) as CustomFormArray;
        if (defectIndex) {
          this.index = Number(defectIndex!);
          this.form = this._defectsForm.controls[this.index] as CustomFormGroup;
          this.defect = this.defects![this.index];
        } else if (defectRef) {
          this.defectsStore.select(selectByDeficiencyRef(defectRef, this.vehicleType)).subscribe(([defect, item, deficiency]) => {
            this.initializeDefect(defect as Defect, item as Item, deficiency as Deficiency);
          });
        }
      });

    this.defectsStore.select(selectByImNumber(this.defect!.imNumber!, this.vehicleType)).subscribe(defectsTaxonomy => {
      this.initializeInfoDictionary(defectsTaxonomy);
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  get isDangerous(): boolean {
    return this.defect!.deficiencyCategory === 'dangerous';
  }

  get isAdvisory(): Boolean {
    return this.defect!.deficiencyCategory === 'advisory';
  }

  handleSubmit() {
    const errors: GlobalError[] = [];
    DynamicFormService.updateValidity(this.form, errors);

    if (errors.length > 0) {
      this.errorService.setErrors(errors);
    }

    if (this.form.invalid) {
      return;
    }

    if (this.index) {
      this.testResultsStore.dispatch(saveDefect({ defect: this.form.getCleanValue(this.form) as TestResultDefect, index: this.index }));
    } else {
      this.testResultsStore.dispatch(createDefect({ defect: this.form.getCleanValue(this.form) as TestResultDefect }));
    }
    this.resultService.updateResultOfTest();
    this.navigateBack();
  }

  handleRemove() {
    this.testResultsStore.dispatch(removeDefect({ index: this.index }));
    this.resultService.updateResultOfTest();
    this.navigateBack();
  }

  navigateBack() {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  initializeInfoDictionary(defect: Defect | undefined) {
    const infoShorthand = defect?.additionalInfo;

    const info = defect?.additionalInfo[this.vehicleType as keyof typeof infoShorthand] as AdditionalInfoSection | undefined;

    this.includeNotes = !!info?.notes;

    if (info) {
      type LocationKey = keyof typeof info.location;

      Object.keys(info.location).forEach(key => {
        const options = info?.location[key as LocationKey];
        if (options) {
          this.infoDictionary[key] = this.mapOptions(options);
        }
      });
    }
  }

  initializeDefect(defect: Defect, item: Item, deficiency: Deficiency) {
    const testResultDefect: TestResultDefect = {
      imDescription: defect.imDescription,
      imNumber: defect.imNumber,

      itemDescription: item.itemDescription,
      itemNumber: item.itemNumber,

      deficiencyCategory: TestResultDefect.DeficiencyCategoryEnum.Advisory,
      deficiencyRef: `${defect.imNumber}.${item.itemNumber}`
    };

    if (deficiency) {
      testResultDefect.deficiencyCategory = deficiency.deficiencyCategory;
      testResultDefect.deficiencyId = deficiency.deficiencyId;
      testResultDefect.deficiencySubId = deficiency.deficiencySubId;
      testResultDefect.deficiencyText = deficiency.deficiencyText;
      testResultDefect.deficiencyRef = deficiency.ref;
      testResultDefect.stdForProhibition = deficiency.stdForProhibition;
    }

    this._defectsForm!.addControl(testResultDefect);
    this.form = this._defectsForm!.controls[this._defectsForm!.length - 1] as CustomFormGroup;
    this.defect = testResultDefect;
  }

  trackByFn = (_index: number, keyValuePair: KeyValue<string, Array<any>>): string => keyValuePair.key;

  mapOptions = (options: Array<any>): Array<FormNodeOption<any>> =>
    options.map(option => ({ value: option, label: this.pascalCase(String(option)) }));

  pascalCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');

  combined = (...params: any[]): string => params.map(p => this.pipe.transform(p)).join(' / ');

  /**
   * takes the location object where all properties are optional and returns a string with all the properties that have values separated with ` / `.
   * While we don't know how to format the string, we show the properties as `key: value`.
   * TODO: update string format once we have service design.
   * @param location - DefectAdditionalInformationLocation object
   * @returns string
   */
  mapLocationText = (location?: DefectAdditionalInformationLocation): string =>
    !location
      ? '-'
      : Object.entries(location)
          .filter(([, value]) => (typeof value === 'number' && isNaN(value) === false) || value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' / ');
}
