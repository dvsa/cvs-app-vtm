import { DOCUMENT } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomValidators } from '@forms/validators/custom-validators';
import { enhanceSelectElement } from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { takeWhile } from 'rxjs';
import { lastValueFrom, Observable } from 'rxjs';
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
  @Input() options$!: Observable<any[]>;
  @Input() defaultValue: string = '';

  options: any[] = [];

  constructor(injector: Injector, @Inject(DOCUMENT) private document: Document, changeDetectorRef: ChangeDetectorRef) {
    super(injector, changeDetectorRef);
  }

  ngAfterViewInit(): void {
    const self = this;

    lastValueFrom(this.options$.pipe(takeWhile(options => !options || options.length === 0, true)))
      .then(options => {
        this.options = options;

        this.ref.detectChanges();

        enhanceSelectElement({
          selectElement: this.document.querySelector('#' + this.name),
          autoselect: false,
          defaultValue: '',
          showAllValues: true,
          confirmOnBlur: false,
          onConfirm (selected){self.handleChangeForOption(selected)}
        });

        window.document.querySelector(`#${this.name}`)?.addEventListener('change', (event) => this.handleChange(event));
      });
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.addValidators();
  }

  handleChange(event: any) {
    const {
      target: { value }
    } = event;

    this.handleChangeForOption(value);
  }

  handleChangeForOption(value: string){
    const optionValue = this.findOptionValue(value);

    this.control?.patchValue(optionValue ?? '[INVALID_OPTION]');
    this.control?.markAsTouched();
    this.control?.updateValueAndValidity();
    this.ref.detectChanges();
  }

  /**
   * Takes the value from the autocomplete element and looks for a matching option in the options array.
   * Returns the found value or undefined if no match.
   * If value is empty, returns `''`.
   * @param value - value to get option for
   * @returns `string | undefined`
   */
  findOptionValue(label: string) {
    return label ? this.options.find(option => option.label === label)?.value : '';
  }

  addValidators() {
    this.control?.addValidators([CustomValidators.invalidOption]);
  }
}
