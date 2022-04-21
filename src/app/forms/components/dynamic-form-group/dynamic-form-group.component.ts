import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService, FormNode } from '../../services/dynamic-form.service';
import { TestResultModel } from '../../../models/test-result.model';
@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {
  // @Input() source: { [key: string]: DynamicFormControl } = {};

  @Input() data: object = {};
  @Input() schema!: FormNode;

  myForm: FormGroup = new FormGroup({});

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.populateData(this.data, this.schema);
    this.myForm = this.dfs.createForm(this.schema);
    console.log(this.myForm);
  }

  entriesOf(obj: FormGroup): { key: string; value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value
    }));
  }

  trackByFn(index: number) {
    return index;
  }

  populateData(data: any, template: FormNode) {
    Object.keys(data).forEach((dataKey) => {
      if (typeof data[dataKey] === 'object') {
        this.populateData(data[dataKey], template);
      } else {
        if (dataKey === template.name) {
          template.value = data[dataKey];
        } else {
          template.children.forEach((templateChild) => {
            this.populateData(data, templateChild);
          });
        }
      }
      return;
    });
  }
}
