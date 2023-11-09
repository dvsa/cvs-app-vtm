import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate, ReadOnlyADRTemplate } from '@forms/templates/general/adr.template';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import _ from 'lodash';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit {
  @Input() techRecord!: V3TechRecordModel;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;
  @Output() formChange = new EventEmitter();

  public template = AdrTemplate;
  public readonlyTemplate = ReadOnlyADRTemplate;
  public form!: CustomFormGroup;

  constructor(
    private dfs: DynamicFormService,
  ) { }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
  }

  handleFormChange(event: Record<string, unknown>) {
    if (event == null) return;
    const data = _.pickBy(flattenObject(event), (_val, key) => _.startsWith(key, 'techRecord'));

    this.formChange.emit({ ...event, ...data });
  }

}

const flattenObject = (obj: Record<string, unknown>, prefix = '', usePrefix = false) => {
  return Object.keys(obj).reduce((acc: Record<string, unknown>, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (obj[`${k}`] && typeof obj[`${k}`] === 'object') {
      Object.assign(acc, flattenObject(obj[`${k}`] as Record<string, unknown>, pre + k, usePrefix));
    } else {
      acc[usePrefix ? pre + k : k] = obj[`${k}`];
    }

    return acc;
  }, {});
};
