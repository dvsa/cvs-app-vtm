import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CustomFormControl,
  CustomFormGroup,
  FormNodeTypes,
} from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { TC3Types } from '@models/adr.enum';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CustomControlComponentComponent } from '../custom-control-component/custom-control-component.component';

@Component({
  selector: 'app-adr-tank-details-subsequent-inspections',
  templateUrl: './adr-tank-details-subsequent-inspections.component.html',
  styleUrls: ['./adr-tank-details-subsequent-inspections.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsSubsequentInspectionsComponent, multi: true }],
})
export class AdrTankDetailsSubsequentInspectionsComponent extends CustomControlComponentComponent implements OnInit, OnDestroy {
  destroy$ = new ReplaySubject<boolean>(1);

  formArray = new FormArray<CustomFormGroup>([this.createSubsequentInspection(0)]);

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.control?.patchValue(changes, { emitModelToViewChange: true });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createSubsequentInspection(index: number) {
    return new CustomFormGroup({
      name: index.toString(),
      label: 'Subsequent',
      type: FormNodeTypes.GROUP,
      customId: `subsequent[${index}]`,
      children: [
        {
          name: 'techRecord_adrDetails_tank_tankDetails_tc3Details_tc3Type',
          type: FormNodeTypes.CONTROL,
          label: 'TC3: Inspection Type',
          // TO-DO: replace with enum
          options: getOptionsFromEnum(TC3Types),
          customId: `techRecord_adrDetails_tank_tankDetails_tc3Details_tc3Type[${index}]`,
        },
        {
          name: 'techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicNumber',
          label: 'TC3: Certificate Number',
          type: FormNodeTypes.CONTROL,
          customId: `techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicNumber[${index}]`,
        },
        {
          name: 'techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicExpiryDate',
          label: 'TC3: Expiry Date',
          type: FormNodeTypes.CONTROL,
          customId: `techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicExpiryDate[${index}]`,
        },
      ],
    }, {
      techRecord_adrDetails_tank_tankDetails_tc3Details_tc3Type: new CustomFormControl({
        name: 'techRecord_adrDetails_tank_tankDetails_tc3Details_tc3Type',
        type: FormNodeTypes.CONTROL,
      }),
      techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicNumber: new CustomFormControl({
        name: 'techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicNumber',
        type: FormNodeTypes.CONTROL,
      }),
      techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicExpiryDate: new CustomFormControl({
        name: 'techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicExpiryDate',
        type: FormNodeTypes.CONTROL,
      }),
    });
  }

  addSubsequentInspection() {
    this.formArray.push(this.createSubsequentInspection(this.formArray.length));
  }

  removeSubsequentInspection(index: number) {
    if (this.formArray.length < 2) return;
    this.formArray.removeAt(index);
  }
}
