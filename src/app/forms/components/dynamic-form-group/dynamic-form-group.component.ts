import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService, FormNode } from '../../services/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {
  @Input() data: object = {};
  @Input() template!: FormNode;

  myForm: FormGroup = new FormGroup({});

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.populateData(this.data, this.template);
    this.myForm = this.dfs.createForm(this.template);
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
    // NiallB: This populates data without respecting where in the hierarchy it is (see unit tests)
    Object.keys(data).forEach((dataKey) => {
      if (typeof data[dataKey] === 'object') {
        this.populateData(data[dataKey], template);
      } else {
        if (dataKey === template.name) {
          template.value = data[dataKey];
        } else {
          template?.children.forEach((templateChild) => {
            this.populateData(data, templateChild);
          });
        }
      }
      return;
    });
  }
}
