import { NgControl } from '@angular/forms';

export abstract class FormFieldControl {

  id: string;
  ariaDescribedBy: string | null;
  errorMessages?: { rule: string; message: string; }[];

  readonly controlType: string;
  readonly multi: boolean;
  readonly ngControl: NgControl;
}
