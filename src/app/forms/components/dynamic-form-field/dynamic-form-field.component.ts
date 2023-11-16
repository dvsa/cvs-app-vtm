import { KeyValue } from '@angular/common';
import { AfterContentInit, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormControl, FormNodeEditTypes, FormNodeOption } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  providers: [MultiOptionsService],
})
export class DynamicFormFieldComponent implements AfterContentInit {
  @Input() control?: KeyValue<string, CustomFormControl>;
  @Input() form?: FormGroup;
  @Input() customId?: string;

  constructor(private optionsService: MultiOptionsService) {}

  get formNodeEditTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get options$(): Observable<FormNodeOption<string | number | boolean>[]> {
    const meta = this.control?.value.meta;

    return meta?.referenceData
      ? this.optionsService.getOptions(meta.referenceData).pipe(map((l) => (l || [])))
      : of((meta?.options as FormNodeOption<string | number | boolean>[]) ?? []);
  }

  ngAfterContentInit(): void {
    const referenceData = this.control?.value.meta?.referenceData;

    if (referenceData) {
      this.optionsService.loadOptions(referenceData);
    }
  }
}
