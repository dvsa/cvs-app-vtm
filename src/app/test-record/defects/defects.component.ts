import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';

@Component({
  selector: 'vtm-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectsComponent implements OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;

  constructor() {}

  ngOnInit() {}

  concatStrings(strings, concatBy): string {
    const stringsToJoin = strings.length > 1 ? strings.filter(item => item) : [''];
    return stringsToJoin.join(concatBy);
  }
}
