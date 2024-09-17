import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { AfterContentInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomFormGroup } from '@services/dynamic-forms/dynamic-form.types';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ReplaySubject } from 'rxjs';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';

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

  ngOnInit(): void {
    this.adrBodyType = this.parentForm?.get('techRecord_adrDetails_vehicleDetails_type')?.value;
  }

  getOptions() {
    console.log(this.parentForm);
    console.log(this.adrBodyType);
    let enumValues = getOptionsFromEnum(ADRDangerousGood);
    // console.log(this.adrBodyType);
    if (this.adrBodyType?.includes('battery') || this.adrBodyType?.includes('tank')) {
      enumValues = enumValues.filter((option) => option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_3 && option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_2);
      console.log(enumValues);
    }
    return enumValues;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
