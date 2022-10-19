import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControl, FormNode, FormNodeCombinationOptions, FormNodeOption } from '../../services/dynamic-form.types';

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

  title?: string;

  leftNodeData?: any
  rightNodeData?: any

  booleanOptions: FormNodeOption<string | number | boolean>[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  constructor() {
    this.formNode = <FormNode>{};
    this.formGroup = <FormGroup>{};
  }

  ngOnInit(): void {
    const options = <FormNodeCombinationOptions>this.formNode.options;
    this.title = this.formNode.label;
    this.rightNodeData = this.findNodeByName(options.rightComponentName, this.formGroup);
    this.leftNodeData = this.findNodeByName(options.leftComponentName, this.formGroup)
    console.log(this.leftNodeData)
  }
  private findNodeByName(nodeName: string, formGroup: FormGroup) {
    const data = formGroup.get(nodeName)
  return data //want to return just the data.meta
  }

}
