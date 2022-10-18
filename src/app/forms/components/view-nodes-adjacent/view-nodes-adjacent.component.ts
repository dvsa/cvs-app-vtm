import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControl, FormNode, FormNodeCombinationOptions } from '../../services/dynamic-form.types';

@Component({
  selector: 'app-view-nodes-adjacent',
  templateUrl: './view-nodes-adjacent.component.html',
  styleUrls: ['./view-nodes-adjacent.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ViewNodesAdjacentComponent,
      multi: true
    }
  ]
})
export class ViewNodesAdjacentComponent implements OnInit {
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
