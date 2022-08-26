import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-number-plate',
  templateUrl: './number-plate.component.html',
  styleUrls: ['./number-plate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberPlateComponent {}
