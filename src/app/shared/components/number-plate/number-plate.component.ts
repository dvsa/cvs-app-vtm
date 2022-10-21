import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-plate',
  templateUrl: './number-plate.component.html',
  styleUrls: ['./number-plate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberPlateComponent {
  private _vrm: string | undefined;

  @Input() isSecondary: boolean = false;
  @Input() set vrm(value: string | undefined) {
    // formatting: if the number plate is long enough, add a space before the final 3 characters
    if (value?.length >= 5) {
      this._vrm = value.slice(0, value.length -3) + ' ' + value.slice(value.length -3);
    } else {
      this._vrm = value;
    }
  }
  get vrm(): string | undefined {
    return this._vrm;
  }
}
