import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseControlComponent } from '../base-control/base-control.component';

import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNode, FormNodeCombinationOptions } from '../../services/dynamic-form.types';

@Component({
  selector: 'app-view-combination',
  templateUrl: './view-combination.component.html',
  styleUrls: ['./view-combination.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ViewCombinationComponent,
      multi: true
    }
  ]
})
export class ViewCombinationComponent implements OnInit {
  @Input() formNode: FormNode;
  @Input() formGroup: FormGroup;

  leftComponent: BaseControlComponent;
  rightComponent: BaseControlComponent;
  separator: string = ' ';
  label?: string;

  constructor() {
    this.formNode = <FormNode><unknown>{};
    this.formGroup = <FormGroup><unknown>{};
    this.leftComponent = <BaseControlComponent><unknown>{};
    this.rightComponent = <BaseControlComponent><unknown>{};
  }

  ngOnInit(): void {
    console.log(this.formNode)
    console.log(this.formGroup)
    const options = <FormNodeCombinationOptions>(this.formNode.options);
    this.leftComponent = this.findComponentByName(options.leftComponentName, this.formGroup)
    this.rightComponent = this.findComponentByName(options.rightComponentName, this.formGroup)
    this.separator = options.separator;
    this.label = this.formNode.label;
  }



  private findComponentByName(nodeName: string, formGroup: FormGroup): any {
    console.log('Attempting to find combinations')
    return formGroup.controls[nodeName];
  }


}
