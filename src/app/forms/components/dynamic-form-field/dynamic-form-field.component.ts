import { KeyValue } from '@angular/common';
import { AfterContentInit, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormControl, FormNodeEditTypes, FormNodeOption } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { testStations, TestStationsState } from '@store/test-stations';
import { map, mergeMap, Observable, of } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html'
})
export class DynamicFormFieldComponent implements AfterContentInit {
  @Input() control?: KeyValue<string, CustomFormControl>;
  @Input() form?: FormGroup;
  constructor(private referenceDataService: ReferenceDataService, private store: Store<TestStationsState>) {}

  get formNodeEditTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get options(): Observable<FormNodeOption<string | number | boolean>[]> {
    return of(this.control?.value.meta).pipe(
      mergeMap(meta => {
        if (meta?.editType === FormNodeEditTypes.AUTOCOMPLETE ?? (meta?.name === 'testStationName' || meta?.name === 'testStationPNumber')) {

          return this.store.select(testStations).pipe(
            map(testStations => testStations.map(testStation => {
              const value = testStation[meta!.name as keyof typeof testStation] as string | number;
              return { value, label: `${value}` };
            }))
          );
        } else if (!meta || !meta.referenceData) {
          return of(this.control?.value.meta.options as FormNodeOption<string | number | boolean>[] ?? []);
        }

        return this.referenceDataService
          .getAll$((this.control?.value.meta.referenceData ?? '') as ReferenceDataResourceType)
          .pipe(
            map(options => options.map(option => ({ value: option.resourceKey, label: option.description })))
          );
      })
    );
  }

  ngAfterContentInit(): void {
    if (this.control?.value.meta.referenceData) {
      this.referenceDataService.loadReferenceData(this.control.value.meta.referenceData);
    }
  }
}
