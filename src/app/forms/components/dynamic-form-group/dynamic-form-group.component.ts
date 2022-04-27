import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DynamicFormService, FormNode, FormNodeTypes } from '../../services/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {
  @Input() data: any = {};
  @Input() template!: FormNode;

  form: FormGroup | FormArray = new FormGroup({});

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template);
    this.form.patchValue(this.data);
    console.log(this.form);
    console.log(this.form.value);
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
