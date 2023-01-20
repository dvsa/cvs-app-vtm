import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiOption } from '@forms/models/options.model';
import { CustomValidators } from '@forms/validators/custom-validators';
import { firstValueFrom, Observable, skipWhile, take } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-suggestive-input',
  templateUrl: './suggestive-input.component.html',
  styleUrls: ['./suggestive-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SuggestiveInputComponent,
      multi: true
    }
  ]
})
export class SuggestiveInputComponent extends BaseControlComponent implements AfterContentInit, OnInit {
  @Input() options$!: Observable<MultiOption[]>;
  @Input() defaultValue: string = '';

  _value = '';

  constructor(injector: Injector, changeDetectorRef: ChangeDetectorRef) {
    super(injector, changeDetectorRef);
  }

  ngOnInit(): void {
    this.options$
      .pipe(
        skipWhile(options => !options.length),
        take(1)
      )
      .subscribe(async () => {
        this._value = (await this.findOption(this.value, 'value'))?.label ?? '';
      });
  }

  override async ngAfterContentInit(): Promise<void> {
    super.ngAfterContentInit();
    this.addValidators();
  }

  get style(): string {
    return 'govuk-input ' + (this.width ? 'govuk-input--width-' + this.width : '');
  }

  async handleChangeForOption(value: string) {
    const option = await this.findOption(value);

    this._value = option?.label ?? value;
    // if option found, patch option value else if value patch `[INVALID_OPTION]` else value (empty string)
    this.control?.patchValue(option ? option.value : value ? '[INVALID_OPTION]' : value);
    this.cdr.markForCheck();
  }

  /**
   * Takes the value from the autocomplete element and looks for a matching option in the options array.
   * Returns a promise of the found option or undefined if no match.
   * @param {string} value - value to get option for
   * @param {string} key - option search key. Defaults to `label`
   * @returns `MultiOption | undefined`
   */
  async findOption(val: string, key = 'label'): Promise<MultiOption | undefined> {
    return firstValueFrom(this.options$).then(options => options.find(option => option[key as keyof MultiOption] === val));
  }

  addValidators() {
    this.control?.addValidators([CustomValidators.invalidOption]);
  }

  trackByFn(i: number, option: MultiOption) {
    return option.value ?? i;
  }
}
