import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vtm-test-history',
  templateUrl: './test-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
