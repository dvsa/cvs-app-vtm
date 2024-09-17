import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { AfterContentInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomFormGroup } from '@services/dynamic-forms/dynamic-form.types';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ReplaySubject, takeUntil } from 'rxjs';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { MultiOptions } from '@models/options.model';

@Component({
    selector: 'app-adr-permitted-dangerous-goods',
    templateUrl: './adr-permitted-dangerous-goods.component.html',
    styleUrls: ['./adr-permitted-dangerous-goods.component.scss'],
})
export class AdrPermittedDangerousGoodsComponent extends BaseControlComponent
  implements OnInit, OnDestroy, AfterContentInit {

  @Input() parentForm?: CustomFormGroup;
  adrBodyType?: ADRBodyType;
  destroy$ = new ReplaySubject<boolean>(1);
  options?: MultiOptions = [];

  ngOnInit(): void {
    this.adrBodyType = this.parentForm?.get('techRecord_adrDetails_vehicleDetails_type')?.value;
    this.options = this.getOptions();
    this.parentForm?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      const newBodyTypeValue = this.parentForm?.get('techRecord_adrDetails_vehicleDetails_type')?.value;
      if (this.adrBodyType !== newBodyTypeValue) {
        this.adrBodyType = newBodyTypeValue;
        this.options = this.getOptions();
      }
    });
    console.log(this.label);
  }

  getOptions() {
    let enumValues = getOptionsFromEnum(ADRDangerousGood);
    if (this.adrBodyType?.includes('battery') || this.adrBodyType?.includes('tank')) {
      enumValues = enumValues.filter((option) => option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_3 && option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_2);
    }
    return enumValues;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
