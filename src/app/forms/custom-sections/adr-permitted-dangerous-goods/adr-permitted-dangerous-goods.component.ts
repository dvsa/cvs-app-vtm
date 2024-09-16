import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { AfterContentInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomFormGroup } from '@services/dynamic-forms/dynamic-form.types';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';

@Component({
    selector: 'app-adr-permitted-dangerous-goods',
    templateUrl: './adr-permitted-dangerous-goods.component.html',
    styleUrls: ['./adr-permitted-dangerous-goods.component.scss'],
})
export class AdrPermittedDangerousGoodsComponent extends BaseControlComponent
  implements OnInit, OnDestroy, AfterContentInit {

  @Input() parentForm?: CustomFormGroup;
  adrBodyType?: ADRBodyType;


  ngOnInit(): void {
    this.adrBodyType = this.parentForm?.get('techRecord_adrDetails_adrBodyType')?.value;
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
