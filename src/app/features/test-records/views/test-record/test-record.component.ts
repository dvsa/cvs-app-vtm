import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { mergeMap, Observable, of, take, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit, AfterViewInit {
  @ViewChildren(DynamicFormGroupComponent) dynamicFormGroupComponents?: QueryList<DynamicFormGroupComponent>;

  defectTpl: FormNode = DefectTpl;
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defectsData$: Observable<Defects | undefined> = of(undefined);
  edit$: Observable<boolean> = of(false);

  constructor(
    private testRecordsService: TestRecordsService,
    private routerService: RouterService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private globalErrorService: GlobalErrorService
  ) {}

  ngOnInit() {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectsData$ = this.testRecordsService.defectData$;
    this.edit$ = this.routerService.routeEditable$;
  }

  ngAfterViewInit() {
    console.log(this.dynamicFormGroupComponents);
    this.dynamicFormGroupComponents?.changes.subscribe({
      next: (formGroup) => {
        console.log(formGroup);
      }
    });
  }

  handleEdit() {
    this.router.navigate([], { queryParams: { edit: true }, relativeTo: this.route });
  }

  handleSave() {
    let payload: TestResultModel;
    this.dynamicFormGroupComponents?.forEach((component) => {
      payload = { ...component.form.getRawValue() };
      console.log(payload);
    });

    this.routerService
      .getRouteParam$('systemId')
      .pipe(
        take(1),
        withLatestFrom(this.userService.userName$, this.userService.id$),
        mergeMap(([testResultId, username, id]) => this.testRecordsService.saveTestResult({ username, id }, this.cleanUp(payload), testResultId!))
      )
      .subscribe({
        next: (updatedTestResult) => {
          console.log(updatedTestResult);
        },
        error: (err) => {
          console.log(err);
          if (err.status === 400) {
            const { errors } = err.error;
            const globalErrors: GlobalError[] = [];
            errors.forEach((error: string) => {
              const field = error.match(/"([^"]+)"/);
              globalErrors.push({ error, anchorLink: field && field.length > 1 ? field[1].replace('"', '') : '' });
            });
            this.globalErrorService.setErrors(globalErrors);
          }
        }
      });
  }

  handleCancel() {
    this.router.navigate([], { relativeTo: this.route });
  }

  cleanUp(payload: any) {
    delete payload.notesSection;
    delete payload.odometerCombination;
    delete payload.preparerCombination;
    delete payload.testFacilityCombination;
    delete payload.testSection;
    delete payload.vehicleSection;
    delete payload.visitSection;
    return payload;

    this.deletePropDeep(payload, 'particulateTrapSerialNumber');
    this.deletePropDeep(payload, 'particulateTrapFitted');
    this.deletePropDeep(payload, 'modificationTypeUsed');
    this.deletePropDeep(payload, 'modType');
    this.deletePropDeep(payload, 'smokeTestKLimitApplied');
    this.deletePropDeep(payload, 'emissionStandard');
    this.deletePropDeep(payload, 'emissionsSection');
    this.deletePropDeep(payload, 'seatbeltSection');
    this.deletePropDeep(payload, 'prohibitionIssued');
    this.deletePropDeep(payload, 'fuelType');
    this.deletePropDeep(payload, 'certificateNumber');
    this.deletePropDeep(payload, 'testExpiryDate');
    this.deletePropDeep(payload, 'testAnniversaryDate');

    payload.reasonForCancellation = null;
    payload.vehicleSize = 'small';
    payload.vehicleConfiguration = 'rigid';
    payload.numberOfSeats = 80;
    // payload.name = 'Rick';
    payload.numberOfWheelsDriven = 2;
    payload.noOfAxles = 2;
    payload.testerStaffId = 'Mike123';
    payload.testResultId = '2';
    // payload.testTypes[0].additionalNotesRecorded = 'More notes';
    payload.testTypes[0].secondaryCertificateNumber = '34543534';
    payload.testTypes[0].secondaryCertificateNumber = '34543534';
    payload.testTypes[0].customDefects = [];
    payload.testTypes[0].defects = [];
    payload.testTypes[0].testTypeClassification = 'Annual With Certificate';
    payload.testTypes[0].name = 'Rick';

    return payload;
  }

  // function that takes a property name and deletes it from nested objects
  deletePropDeep(obj: any, prop: string) {
    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(prop)) {
        delete obj[prop];
      }

      if (obj[key] && typeof obj[key] === 'object') {
        this.deletePropDeep(obj[key], prop);
      }
    });
  }
}
