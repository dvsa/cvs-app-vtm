import { AfterContentInit, Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputComponent,
      multi: true,
    },
  ],
})
export class NumberInputComponent extends BaseControlComponent implements AfterContentInit {
  @Input() vehicleType?: string | null;
  @Input() enableDecimals: boolean | undefined = false;
  get style(): string {
    return `govuk-input ${this.width ? `govuk-input--width-${this.width}` : ''}`;
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    if (this.control) {
      this.control.meta.customId = this.name;
    }
  }
}
