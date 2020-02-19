import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Tank } from '@app/models/Tank';

@Component({
  selector: 'vtm-tank-details',
  templateUrl: './tank-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankDetailsComponent implements OnInit {
  @Input() edit: boolean;
  @Input() tank: Tank;

  constructor() {}

  ngOnInit() {}
}
