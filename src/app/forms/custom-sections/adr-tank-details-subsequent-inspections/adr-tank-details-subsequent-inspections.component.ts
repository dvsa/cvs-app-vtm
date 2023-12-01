import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CustomFormControl,
  CustomFormGroup,
  FormNodeTypes,
  FormNodeViewTypes,
} from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { TC3Types } from '@models/adr.enum';
import { RouterService } from '@services/router/router.service';
import {
  Observable,
  ReplaySubject,
  map,
  take,
  takeUntil,
} from 'rxjs';
import { CustomControlComponentComponent } from '../custom-control-component/custom-control-component.component';

@Component({
  selector: 'app-adr-tank-details-subsequent-inspections',
  templateUrl: './adr-tank-details-subsequent-inspections.component.html',
  styleUrls: ['./adr-tank-details-subsequent-inspections.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsSubsequentInspectionsComponent, multi: true }],
})
export class AdrTankDetailsSubsequentInspectionsComponent extends CustomControlComponentComponent implements OnInit, OnDestroy, AfterContentInit {
  destroy$ = new ReplaySubject<boolean>(1);

  formArray = new FormArray<CustomFormGroup>([]);

  isEditing?: boolean;

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.control?.patchValue(changes, { emitModelToViewChange: true });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    const value = this.form?.get(this.name)?.value;
    const values = Array.isArray(value) && value.length ? value : [this.createSubsequentInspection(0).value];

    values.forEach((formValue: { tc3Type: string, tc3PeriodicNumber: string, tc3PeriodicExpiryDate: string }, index: number) => {
      const control = this.createSubsequentInspection(index);
      control.patchValue(formValue);
      this.formArray.push(control);

    });
  }

  createSubsequentInspection(index: number) {
    return new CustomFormGroup({
      name: index.toString(),
      label: 'Subsequent',
      type: FormNodeTypes.GROUP,
      customId: `subsequent[${index}]`,
      children: [
        {
          name: 'tc3Type',
          type: FormNodeTypes.CONTROL,
          label: 'TC3: Inspection Type',
          // TO-DO: replace with enum
          options: getOptionsFromEnum(TC3Types),
          customId: `tc3Type[${index}]`,
        },
        {
          name: 'tc3PeriodicNumber',
          label: 'TC3: Certificate Number',
          type: FormNodeTypes.CONTROL,
          customId: `tc3PeriodicNumber[${index}]`,
        },
        {
          name: 'tc3PeriodicExpiryDate',
          label: 'TC3: Expiry Date',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE,
          customId: `tc3PeriodicExpiryDate[${index}]`,
        },
      ],
    }, {
      tc3Type: new CustomFormControl({
        name: 'tc3Type',
        type: FormNodeTypes.CONTROL,
      }),
      tc3PeriodicNumber: new CustomFormControl({
        name: 'tc3PeriodicNumber',
        type: FormNodeTypes.CONTROL,
      }),
      tc3PeriodicExpiryDate: new CustomFormControl({
        name: 'tc3PeriodicExpiryDate',
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
