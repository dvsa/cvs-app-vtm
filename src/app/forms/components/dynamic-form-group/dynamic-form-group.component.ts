import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormArray, CustomFormGroup, DynamicFormService, FormNode, FormNodeTypes } from '../../services/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {
  @Input() data: any = {};
  @Input() template!: FormNode;

  form: CustomFormGroup | CustomFormArray = new CustomFormGroup({ name: 'dynamic-form', type: FormNodeTypes.GROUP, children: [] }, {});

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template);
    this.form.patchValue(this.data);
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

  get formNodeViewTypes(): typeof FormNodeTypes {
    return FormNodeTypes;
  }
}
