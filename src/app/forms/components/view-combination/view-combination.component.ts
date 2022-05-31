import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControl, FormNode, FormNodeCombinationOptions } from '../../services/dynamic-form.types';

@Component({
  selector: 'app-view-combination',
  templateUrl: './view-combination.component.html',
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

  leftComponent?: CustomFormControl;
  rightComponent?: CustomFormControl;
  separator: string = ' ';
  label?: string;

  constructor() {
    this.formNode = <FormNode>{};
    this.formGroup = <FormGroup>{};
  }

  ngOnInit(): void {
    const options = <FormNodeCombinationOptions>this.formNode.options;
    this.leftComponent = this.findComponentByName(options.leftComponentName, this.formGroup);
    this.rightComponent = this.findComponentByName(options.rightComponentName, this.formGroup);
    this.separator = options.separator;
    this.label = this.formNode.label;
  }

  private findComponentByName(nodeName: string, formGroup: FormGroup): CustomFormControl {
    return formGroup.get(nodeName) as CustomFormControl;
  }
}
