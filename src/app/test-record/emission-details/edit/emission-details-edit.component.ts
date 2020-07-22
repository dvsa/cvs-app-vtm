import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { EMISSION_STANDARD, FUEL_TYPE, MOD_TYPE } from '@app/test-record/test-record.enums';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'vtm-emission-details-edit',
  templateUrl: './emission-details-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class EmissionDetailsEditComponent implements OnInit, OnDestroy {
  @Input() testType: TestType;
  emissionStandardOptions: string[] = Object.values(EMISSION_STANDARD);
  fuelTypeOptions: string[] = Object.values(FUEL_TYPE);
  modTypeOptions: string[] = Object.values(MOD_TYPE);
  editModTypeUsed: boolean;
  editParticulate: boolean;
  testResultChildForm: FormGroupDirective;
  testTypeGroup: FormGroup;
  modTypeSubscription: Subscription;
  modTypeValue: string;

  constructor(parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.modTypeValue = !!this.testType.modType
      ? this.testType.modType.code + ' - ' + this.testType.modType.description
      : '';
    this.editParticulate = !!this.testType.modType
      ? this.modTypeValue === 'p - particulate trap'
      : false;
    this.editModTypeUsed = !!this.testType.modType
      ? this.modTypeValue === 'g - gas engine' ||
        this.modTypeValue === 'm - modification or change of engine'
      : false;

    this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;
    if (!this.testTypeGroup) {
      this.testResultChildForm.form.addControl('testType', new FormGroup({}));
      this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;
    }

    if (!!this.testTypeGroup) {
      this.testTypeGroup.addControl(
        'emissionStandard',
        new FormControl(this.testType.emissionStandard)
      );
      this.testTypeGroup.addControl(
        'smokeTestKLimitApplied',
        new FormControl(this.testType.smokeTestKLimitApplied)
      );
      this.testTypeGroup.addControl('fuelType', new FormControl(this.testType.fuelType));
      this.testTypeGroup.addControl('modType', new FormControl(this.testType.modType));
      this.testTypeGroup.addControl(
        'modificationTypeUsed',
        new FormControl(this.testType.modificationTypeUsed)
      );
      this.testTypeGroup.addControl(
        'particulateTrapFitted',
        new FormControl(this.testType.particulateTrapFitted)
      );
      this.testTypeGroup.addControl(
        'particulateTrapSerialNumber',
        new FormControl(this.testType.particulateTrapSerialNumber)
      );

      this.modTypeSubscription = this.testTypeGroup
        .get('modType')
        .valueChanges.subscribe((value) => {
          this.editParticulate = value === 'p - particulate trap';
          this.editModTypeUsed =
            value === 'g - gas engine' || value === 'm - modification or change of engine';
        });
    }
  }

  ngOnDestroy() {
    this.modTypeSubscription.unsubscribe();
  }
}
