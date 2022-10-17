import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CustomFormArray, CustomFormGroup, FormNodeOption } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { select, Store } from '@ngrx/store';
import { createDefect, removeDefect, testResultInEdit, toEditOrNotToEdit, updateDefect } from '@store/test-records';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { filter, Subject, takeUntil, take, withLatestFrom } from 'rxjs';
import { Defect } from '@models/defects/defect.model';
import { AdditionalInfoSection } from '@models/defects/additional-information.model';
import { KeyValue } from '@angular/common';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { ActivatedRoute, Router } from '@angular/router';
import { selectByDeficiencyRef, selectByImNumber } from '@store/defects';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { DefectsTpl } from '@forms/templates/general/defect.template';
import { selectRouteParam } from '@store/router/selectors/router.selectors';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { State } from '@store/index';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.scss'],
  providers: [DefaultNullOrEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectComponent implements OnInit, OnDestroy {
  form!: CustomFormGroup;
  index!: number;
  isEditing: boolean;
  includeNotes = false;
  private vehicleType?: VehicleTypes;

  private _defectsForm?: CustomFormArray;
  private defects?: TestResultDefects;
  defect?: TestResultDefect;

  infoDictionary: Record<string, Array<FormNodeOption<any>>> = {};
  onDestroy$ = new Subject();

  booleanOptions: FormNodeOption<string | number | boolean>[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dfs: DynamicFormService,
    private router: Router,
    private store: Store<State>,
    private resultService: ResultOfTestService,
    private errorService: GlobalErrorService
  ) {
    this.isEditing = this.activatedRoute.snapshot.data['isEditing'];
  }

  ngOnInit(): void {
    const defectIndex = this.store.pipe(select(selectRouteParam('defectIndex')));
    const defectRef = this.store.pipe(select(selectRouteParam('ref')));

    this.store
      .select(this.isEditing ? testResultInEdit : toEditOrNotToEdit)
      .pipe(
        withLatestFrom(defectIndex, defectRef),
        takeUntil(this.onDestroy$),
        filter(([testResult]) => !!testResult)
      )
      .subscribe(([testResult, defectIndex, defectRef]) => {
        !testResult && this.navigateBack();
        this.defects = testResult?.testTypes[0].defects;
        this.vehicleType = testResult?.vehicleType;
        this._defectsForm = (this.dfs.createForm(DefectsTpl, testResult) as CustomFormGroup).get(['testTypes', '0', 'defects']) as CustomFormArray;
        if (defectIndex) {
          this.index = Number(defectIndex);
          this.form = this._defectsForm.controls[this.index] as CustomFormGroup;
          this.defect = this.defects![this.index];
        } else if (defectRef && this.vehicleType) {
          this.store
            .select(selectByDeficiencyRef(defectRef, this.vehicleType))
            .pipe(take(1))
            .subscribe(([defect, item, deficiency]) => {
              this.initializeDefect(defect as Defect, item as Item, deficiency as Deficiency);
            });
        }
      });

    !this.defect && this.navigateBack();

    this.vehicleType &&
      this.store
        .select(selectByImNumber(this.defect?.imNumber || NaN, this.vehicleType))
        .pipe(
          takeUntil(this.onDestroy$),
          filter(d => !!d)
        )
        .subscribe(defectsTaxonomy => {
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

  get isAdvisory(): boolean {
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

    if (this.index || this.index === 0) {
      this.store.dispatch(updateDefect({ defect: this.form.getCleanValue(this.form) as TestResultDefect, index: this.index }));
    } else {
      this.store.dispatch(createDefect({ defect: this.form.getCleanValue(this.form) as TestResultDefect }));
    }

    this.navigateBack();
  }

  handleRemove() {
    this.store.dispatch(removeDefect({ index: this.index }));
    this.navigateBack();
  }

  navigateBack() {
    this.resultService.updateResultOfTest();
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  toggleDefectField(field: keyof TestResultDefect) {
    if (!this.defect) {
      return;
    }
    this.defect = { ...this.defect, [field]: !this.defect[field] } as TestResultDefect;
    this._defectsForm?.controls[this.index ?? this._defectsForm.length - 1].get(field)?.patchValue(this.defect[field]);
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

      //initializing if defect is advisory
      deficiencyCategory: TestResultDefect.DeficiencyCategoryEnum.Advisory,
      deficiencyRef: `${defect.imNumber}.${item.itemNumber}`,
      prohibitionIssued: false
    };

    if (deficiency) {
      testResultDefect.deficiencyCategory = deficiency.deficiencyCategory;
      testResultDefect.deficiencyId = deficiency.deficiencyId;
      testResultDefect.deficiencySubId = deficiency.deficiencySubId;
      testResultDefect.deficiencyText = deficiency.deficiencyText;
      testResultDefect.deficiencyRef = deficiency.ref;
      testResultDefect.stdForProhibition = deficiency.stdForProhibition;
    } else if (item.itemDescription.endsWith(':')) {
      testResultDefect.itemDescription = item.itemDescription.slice(0, -1);
    }

    this._defectsForm!.addControl(testResultDefect);
    this.form = this._defectsForm!.controls[this._defectsForm!.length - 1] as CustomFormGroup;
    this.defect = testResultDefect;
  }

  categoryColor(category: string = 'major'): 'red' | 'orange' | 'yellow' | 'green' | 'blue' {
    return (<Record<string, 'red' | 'orange' | 'green' | 'yellow' | 'blue'>>{ major: 'orange', minor: 'yellow', dangerous: 'red', advisory: 'blue' })[
      category
    ];
  }

  trackByFn = (_index: number, keyValuePair: KeyValue<string, Array<any>>): string => keyValuePair.key;

  mapOptions = (options: Array<any>): Array<FormNodeOption<any>> =>
    options.map(option => ({ value: option, label: this.pascalCase(String(option)) }));

  pascalCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
}
