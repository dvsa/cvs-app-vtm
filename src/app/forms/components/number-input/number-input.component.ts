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
  @Input() targetVehicle?: string | null;
  get style(): string {
    return `govuk-input ${this.width ? `govuk-input--width-${this.width}` : ''}`;
  }

  get getWarningMessage(): string {

    if (this.isTargetVehicle()) {
      if (this.isLengthWarning()) return 'This length dimension field value is greater than 12,000mm. Check your input before proceeding';
      if (this.isWidthWarning()) return 'This width dimension field value is greater than 2,600mm. Check your input before proceeding';
    }
    return '';
  }

  isLengthWarning(): boolean {
    return this.label === 'Length' && Number(this.value) > 12000;
  }
  isWidthWarning(): boolean {
    return this.label === 'Width' && Number(this.value) > 2600;
  }

  isTargetVehicle(): boolean {
    return this.targetVehicle === 'hgv' || this.targetVehicle === 'trl';
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    if (this.control) {
      this.control.meta.customId = this.name;
    }
  }
}
