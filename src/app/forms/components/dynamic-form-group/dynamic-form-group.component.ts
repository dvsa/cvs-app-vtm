import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService, FormNode } from '../../services/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {
  // @Input() source: { [key: string]: DynamicFormControl } = {};
  myForm: FormGroup = new FormGroup({});

  public data: FormNode = {
    name: 'form',
    type: 'group',
    children: [
      {
        name: 'createdAt',
        label: 'Created',
        value: '',
        children: [],
        type: 'control'
      },
      {
        name: 'vrm',
        label: 'VRM',
        value: '',
        children: [],
        type: 'control'
      },
      {
        name: 'vin',
        label: 'VIN/chassis number',
        value: '',
        children: [],
        type: 'control'
      },
      {
        name: 'testStatus',
        label: 'Test status',
        value: '',
        children: [],
        type: 'control'
      },
      {
        name: 'testStartTimestamp',
        label: 'Test Date',
        value: '',
        children: [],
        type: 'control'
      },
      {
        name: 'testTypes',
        type: 'group',
        path: 'testTypes',
        children: [
          {
            name: 'testResult',
            label: 'Test result',
            value: '',
            children: [],
            type: 'control'
          },
          {
            name: 'testCode',
            label: 'Test Code',
            value: '',
            children: [],
            type: 'control'
          },
          {
            name: 'testTypeName',
            label: 'Description',
            value: '',
            children: [],
            type: 'control'
          },
          {
            name: 'certificateNumber',
            label: 'Certificate number',
            value: '',
            children: [],
            type: 'control'
          },
          {
            name: 'testNumber',
            label: 'Test Number',
            value: '',
            children: [],
            type: 'control'
          },
          {
            name: 'testExpiryDate',
            label: 'Expiry Date',
            value: '',
            children: [],
            type: 'control'
          }
        ]
      }
    ]
  };

  // I initialize the app component.
  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.myForm = this.dfs.createForm(this.data);
    console.log(this.myForm);
  }

  entriesOf(obj: any): { key: string; value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value
    }));
  }

  trackByFn(index: number) {
    return index;
  }
}
