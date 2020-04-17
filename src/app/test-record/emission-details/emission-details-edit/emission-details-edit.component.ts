import {Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy} from '@angular/core';
import { TestType } from '@app/models/test.type';
import { EMISSION_STANDARD, FUEL_TYPE, MOD_TYPE } from '@app/test-record/test-record.enums';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'vtm-emission-details-edit',
  templateUrl: './emission-details-edit.component.html',
  styleUrls: ['./emission-details-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class EmissionDetailsEditComponent implements OnInit, OnDestroy {
  @Input() testType: TestType;
  @Input() formErrors: string[];
  emissionStandardOptions: string[] = Object.values(EMISSION_STANDARD);
  fuelTypeOptions: string[] = Object.values(FUEL_TYPE);
  modTypeOptions: string[] = Object.values(MOD_TYPE);
  editModTypeUsed: boolean;
  editParticulate: boolean;
  testResultChildForm: FormGroupDirective;
  testTypeGroup: FormGroup;
  modTypeSubscription: Subscription;

  constructor(parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;

    if (!!this.testTypeGroup) {
      this.testTypeGroup.addControl(
        'emissionStandard',
        new FormControl(this.testType.emissionStandard, Validators.required)
      );
      this.testTypeGroup.addControl(
        'smokeTestKLimitApplied',
        new FormControl(this.testType.smokeTestKLimitApplied, Validators.required)
      );
      this.testTypeGroup.addControl('fuelType', new FormControl(this.testType.fuelType, Validators.required));
      this.testTypeGroup.addControl('modType', new FormControl(this.testType.modType, Validators.required));
      this.testTypeGroup.addControl(
        'modificationTypeUsed',
        new FormControl(this.testType.modificationTypeUsed, Validators.required)
      );
      this.testTypeGroup.addControl(
        'particulateTrapFitted',
        new FormControl(this.testType.particulateTrapFitted, Validators.required)
      );
      this.testTypeGroup.addControl(
        'particulateTrapSerialNumber',
        new FormControl(this.testType.particulateTrapSerialNumber, Validators.required)
      );

      this.modTypeSubscription = this.testTypeGroup.get('modType').valueChanges.subscribe((value) => {
        this.editParticulate = value === 'P - Particulate trap';
        this.editModTypeUsed = value === 'G - Gas engine';
      });
    }
  }

  ngOnDestroy() {
    this.modTypeSubscription.unsubscribe();
  }
}
