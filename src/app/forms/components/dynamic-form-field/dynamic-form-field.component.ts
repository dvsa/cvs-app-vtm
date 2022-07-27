import { KeyValue } from '@angular/common';
import { AfterContentInit, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormControl, FormNodeEditTypes, FormNodeOption } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { fetchTestStations, TestStationsState } from '@store/test-stations';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html'
})
export class DynamicFormFieldComponent implements AfterContentInit {
  @Input() control?: KeyValue<string, CustomFormControl>;
  @Input() form?: FormGroup;

  constructor(
    private referenceDataService: ReferenceDataService,
    private store: Store<TestStationsState>,
    private testStationsService: TestStationsService) {}

  get formNodeEditTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get options(): Observable<FormNodeOption<string | number | boolean>[]> {
    const meta = this.control?.value.meta

    if (meta?.editType === FormNodeEditTypes.AUTOCOMPLETE && meta?.name.startsWith('testStation')) {
      return this.testStationsService.getTestStationsOptions(meta.name);
    } else if (meta?.referenceData) {
      return this.referenceDataService.getReferenceDataOptions((this.control?.value.meta.referenceData ?? '') as ReferenceDataResourceType);
    } else {
      return of(this.control?.value.meta.options as FormNodeOption<string | number | boolean>[] ?? []);
    }
  }

  ngAfterContentInit(): void {
    const meta = this.control?.value.meta

    if (meta?.referenceData) {
      this.referenceDataService.loadReferenceData(meta.referenceData);
    }

    if (meta?.editType === FormNodeEditTypes.AUTOCOMPLETE && meta?.name.startsWith('testStation')) {
      this.store.dispatch(fetchTestStations());
    }
  }
}
