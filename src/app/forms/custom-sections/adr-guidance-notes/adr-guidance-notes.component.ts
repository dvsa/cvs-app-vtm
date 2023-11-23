import {
  Component,
} from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';

@Component({
  selector: 'app-adr-guidance-notes',
  templateUrl: './adr-guidance-notes.component.html',
  styleUrls: ['./adr-guidance-notes.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdrGuidanceNotesComponent, multi: true }],
})
export class AdrGuidanceNotesComponent extends BaseControlComponent {

  form?: FormGroup;

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    this.form = this.injector.get(FORM_INJECTION_TOKEN) as FormGroup;
  }

  addGuidanceNote() {}
}
