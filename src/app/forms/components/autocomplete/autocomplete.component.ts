import { DOCUMENT } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomValidators } from '@forms/validators/custom-validators';
import { enhanceSelectElement } from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutocompleteComponent,
      multi: true
    }
  ]
})
export class AutocompleteComponent extends BaseControlComponent implements AfterViewInit, AfterContentInit {
  @Input() options: any[] = [];
  @Input() defaultValue: string = '';

  constructor(injector: Injector, @Inject(DOCUMENT) private document: Document, changeDetectorRef: ChangeDetectorRef) {
    super(injector, changeDetectorRef);
  }

  ngAfterViewInit(): void {
    enhanceSelectElement({
      selectElement: this.document.querySelector('#' + this.name),
      autoselect: false,
      defaultValue: '',
      // onConfirm: (value) => this.handleConfirm(value),
      // confirmOnBlur: false,
      showAllValues: true
    });
    window.document.querySelector(`#${this.name}`)?.addEventListener('change', (event) => this.handleChange(event));
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.addValidators();
  }

  handleConfirm(option: any) {
    this.value = option.label;
    this.ref.detectChanges();
  }

  handleChange(event: any) {
    const {
      target: { value }
    } = event;
    console.log(event);

    const optionValue = this.getOptionForValue(value);

    this.control?.patchValue(optionValue ?? '[INVALID_OPTION]');
    this.control?.markAsTouched();
    this.control?.updateValueAndValidity();
    this.ref.detectChanges();
  }

  /**
   * Takes the value from the autocomplete element and looks for a matching option in the options array.
   * Returns the dound value or undefined if not match.
   * If value is empty, returns `''`.
   * @param value - value to get option for
   * @returns `string | undefined`
   */
  getOptionForValue(value: string) {
    return value ? this.options.find((option) => option.label === value)?.value : '';
  }

  addValidators() {
    this.control?.addValidators([CustomValidators.invalidOption]);
  }
}
