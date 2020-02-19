import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { Tank } from '@app/models/Tank';
import { PRODUCT_LIST, STATEMENT } from '../../adr.constants';
import { SUBSTANCES } from '@app/app.enums';

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

  super() {}

  ngOnInit() {
    this.adrForm = super.setUp();

    const substanceReferenceSelect: string =
      this.tank.tankStatement && this.tank.tankStatement.statement
        ? this.substanceStatementSelect
        : this.tank.tankStatement && this.tank.tankStatement.productListRefNo
        ? this.substanceProductSelect
        : '';

    let { substancesPermitted } = this.tank.tankStatement;
    substancesPermitted = substancesPermitted
      .toLowerCase()
      .trim()
      .replace(/ /gi, '');

    this.adrForm.addControl(
      'tank',
      this.fb.group({
        tankDetails: this.fb.group({
          tankManufacturer: this.fb.control(this.tank.tankDetails.tankManufacturer),
          yearOfManufacture: this.fb.control(this.tank.tankDetails.yearOfManufacture),
          tankManufacturerSerialNo: this.fb.control(
            this.tank.tankDetails.tankManufacturerSerialNo
          ),
          tankTypeAppNo: this.fb.control(this.tank.tankDetails.tankTypeAppNo),
          tankCode: this.fb.control(this.tank.tankDetails.tankCode),
          specialProvisions: this.fb.control(this.tank.tankDetails.specialProvisions)
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
          statement: this.fb.control(this.tank.tankStatement.statement),
          productListRefNo: this.fb.control(this.tank.tankStatement.productListRefNo),
          productListUnNo: this.fb.array(
            this.buildUNNumberControl(this.tank.tankStatement.productListUnNo)
          ),
          productList: this.fb.control(this.tank.tankStatement.productList)
        })
      })
    );

    this.handleFormChanges();
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
    // this.productListUnNo.setErrors(null);
    this.productListUnNo.markAsDirty();
  }

  removeAllUNNumberControl(): void {
    let index = this.productListUnNo.controls.length - 1;
    for (; index >= 0; index--) {
      this.removeUNNumberControl(index);
    }
  }

  handleFormChanges() {
    this.substancesPermitted.valueChanges
      .pipe(
        tap((value) => {
          if (value === this.permittedSubstance) {
            this.substanceReferenceSelect.reset();
            this.tankStatement.get('statement').reset();
            this.tankStatement.get('productListRefNo').reset();
            this.removeAllUNNumberControl();
            this.productListUnNo.reset();
            this.tankStatement.get('productList').reset();
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();

    this.substanceReferenceSelect.valueChanges
      .pipe(
        tap((value) => {
          if (value === this.substanceStatementSelect) {
            this.tankStatement.get('productListRefNo').reset();
            this.removeAllUNNumberControl();
            this.productListUnNo.reset();
            this.tankStatement.get('productList').reset();
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
}
