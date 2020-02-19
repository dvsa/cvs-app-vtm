import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { Tank, TankDetails, TankStatement } from '@app/models/Tank';
import { PRODUCT_LIST, STATEMENT } from '../../adr.constants';
import { SUBSTANCES } from '@app/app.enums';
import { ValidationState, STATUS } from '../../adr-validation.mapper';

@Component({
  selector: 'vtm-tank-details-edit',
  templateUrl: './tank-details-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankDetailsEditComponent extends AdrComponent implements OnInit {
  permittedSubstance = SUBSTANCES.PERMITTED;
  classNumberSubstance = SUBSTANCES.CLASSNUMBER;

  substanceStatementSelect = STATEMENT;
  substanceProductSelect = PRODUCT_LIST;
  adrForm: FormGroup;
  showTankDetails = true;
  tankValidationState$: Observable<ValidationState>;

  @Input() tank: Tank;

  get tankDetails() {
    return this.adrForm.get('tank.tankDetails') as FormGroup;
  }

  get tankStatement() {
    return this.adrForm.get('tank.tankStatement') as FormGroup;
  }

  get substancesPermitted() {
    return this.tankStatement.get('substancesPermitted') as FormControl;
  }

  get substanceReferenceSelect() {
    return this.tankStatement.get('substanceReferenceSelect') as FormControl;
  }

  get productListUnNo() {
    return this.tankStatement.get('productListUnNo') as FormArray;
  }

  /**
   * TODO: GAP to be implemented. Fields should be set as mandatory on init if
   * existing vehicle is of type battery or tank. Figure out a strategy
   */

  ngOnInit() {
    this.adrForm = super.setUp();
    this.tankValidationState$ = this.validationMapper.getVehicleTypeState();

    const tankData: Tank = !!this.tank ? this.tank : ({} as Tank);
    const tankDataStmt: TankStatement = !!tankData.tankStatement
      ? tankData.tankStatement
      : ({} as TankStatement);
    const tankDataDetails: TankDetails = !!tankData.tankDetails
      ? tankData.tankDetails
      : ({} as TankDetails);

    this.initControls(tankDataStmt, tankDataDetails);
    this.handleFormChanges();
  }

  initControls(tankDataStmt: TankStatement, tankDataDetails: TankDetails): void {
    const substanceReferenceSelect: string = tankDataStmt.statement
      ? this.substanceStatementSelect
      : tankDataStmt.productListRefNo
      ? this.substanceProductSelect
      : '';

    let { substancesPermitted } = tankDataStmt;
    substancesPermitted = !!substancesPermitted
      ? this.getSubstancesPermittedInCode(substancesPermitted)
      : '';

    this.adrForm.addControl(
      'tank',
      this.fb.group({
        tankDetails: this.fb.group({
          tankManufacturer: this.fb.control(tankDataDetails.tankManufacturer),
          yearOfManufacture: this.fb.control(tankDataDetails.yearOfManufacture),
          tankManufacturerSerialNo: this.fb.control(tankDataDetails.tankManufacturerSerialNo),
          tankTypeAppNo: this.fb.control(tankDataDetails.tankTypeAppNo),
          tankCode: this.fb.control(tankDataDetails.tankCode),
          specialProvisions: this.fb.control(tankDataDetails.specialProvisions)
        }),
        tankStatement: this.fb.group({
          substancesPermitted: this.fb.control(
            substancesPermitted.includes(SUBSTANCES.PERMITTED_CODE)
              ? this.permittedSubstance
              : substancesPermitted.includes(SUBSTANCES.CLASSNUMBER_CODE)
              ? this.classNumberSubstance
              : ''
          ),
          substanceReferenceSelect: this.fb.control(substanceReferenceSelect),
          statement: this.fb.control(tankDataStmt.statement),
          productListRefNo: this.fb.control(tankDataStmt.productListRefNo),
          productListUnNo: this.fb.array(this.buildUNNumberControl(tankDataStmt.productListUnNo)),
          productList: this.fb.control(tankDataStmt.productList)
        })
      })
    );
  }

  getSubstancesPermittedInCode(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/ /gi, '');
  }

  buildUNNumberControl(productList: string[]): AbstractControl[] {
    const list = !productList ? [] : productList;
    return list.map((item) => this.fb.control(item));
  }

  addUNNumberControl() {
    this.productListUnNo.push(this.fb.control(''));
    this.productListUnNo.markAsDirty();
  }

  removeUNNumberControl(index: number): void {
    this.productListUnNo.removeAt(index);
    this.productListUnNo.markAsDirty();
  }

  removeAllUNNumberControl(): void {
    let index = this.productListUnNo.controls.length - 1;
    for (; index >= 0; index--) {
      this.removeUNNumberControl(index);
    }
  }

  handleFormChanges() {
    this.substancesPermittedChanges();
    this.substanceReferenceSelectChanges();
    this.vehicleTypeChangesForTankEdit();
  }

  substancesPermittedChanges() {
    this.substancesPermitted.valueChanges
      .pipe(
        tap((value) => {
          if (value === this.permittedSubstance) {
            this.substanceReferenceSelect.reset();
            this.tankStatement.get('statement').reset();
            this.resetControlsWithinProductList();
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  resetControlsWithinProductList() {
    this.tankStatement.get('productListRefNo').reset();
    this.removeAllUNNumberControl();
    this.productListUnNo.reset();
    this.tankStatement.get('productList').reset();
  }

  substanceReferenceSelectChanges() {
    this.substanceReferenceSelect.valueChanges
      .pipe(
        tap((value) => {
          if (value === this.substanceStatementSelect) {
            this.resetControlsWithinProductList();
          }

          if (value === this.substanceProductSelect) {
            this.tankStatement.get('statement').reset();
            this.addUNNumberControl();
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  vehicleTypeChangesForTankEdit() {
    this.tankValidationState$
      .pipe(
        tap(({ tankDetailsEdit }) => {
          if (tankDetailsEdit === STATUS.HIDDEN) {
            this.showTankDetails = false;
            this.tankDetails.reset();
            this.tankDetails.get('tankManufacturer').clearValidators();
            this.tankDetails.get('tankManufacturer').setErrors(null);

            this.tankDetails.get('yearOfManufacture').clearValidators();
            this.tankDetails.get('yearOfManufacture').setErrors(null);

            this.tankDetails.get('tankManufacturerSerialNo').clearValidators();
            this.tankDetails.get('tankManufacturerSerialNo').setErrors(null);

            this.tankDetails.get('tankTypeAppNo').clearValidators();
            this.tankDetails.get('tankTypeAppNo').setErrors(null);

            this.tankDetails.get('tankCode').clearValidators();
            this.tankDetails.get('tankCode').setErrors(null);

            this.tankStatement.reset();
            this.tankStatement.get('substancesPermitted').clearValidators();
            this.tankStatement.get('substancesPermitted').setErrors(null);
          }

          if (tankDetailsEdit === STATUS.MANDATORY) {
            this.showTankDetails = true;
            this.tankDetails.get('tankManufacturer').setValidators([Validators.required]);
            this.tankDetails.get('yearOfManufacture').setValidators([Validators.required]);
            this.tankDetails.get('tankManufacturerSerialNo').setValidators([Validators.required]);
            this.tankDetails.get('tankTypeAppNo').setValidators([Validators.required]);
            this.tankDetails.get('tankCode').setValidators([Validators.required]);
            this.tankStatement.get('substancesPermitted').setValidators([Validators.required]);
          }

          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }
}
