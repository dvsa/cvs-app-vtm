import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vtm-defects-edit',
  templateUrl: './defects-edit.component.html',
  styleUrls: ['./defects-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectsEditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
