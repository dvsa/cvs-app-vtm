import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { DynamicFormService } from '../../services/dynamic-form.service';

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
        name: 'address',
        type: 'group',
        path: 'address',
        children: [
          {
            name: 'street',
            label: 'Street',
            type: 'group',
            children: [
              {
                name: 'house',
                label: 'House',
                type: 'control',
                children: []
              }
            ],
            value: ''
          },
          {
            name: 'postcode',
            label: 'Postcode',
            value: 'NE8',
            type: 'control',
            children: []
          }
        ]
      },
      {
        name: 'name',
        label: 'Name',
        value: '',
        children: [],
        type: 'control'
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

export interface FormNode {
  name: string;
  label?: string;
  value?: string;
  path?: string;
  type: 'control' | 'group' | 'array';
  validators?: string[];
  children: FormNode[];
}
