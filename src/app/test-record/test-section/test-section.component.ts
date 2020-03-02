import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

@Component({
  selector: 'vtm-test-section',
  templateUrl: './test-section.component.html',
  styleUrls: ['./test-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSectionComponent implements OnInit {

  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  applicableTestTypeIds1: string[] = ['1', '3', '4', '7', '8', '10', '14', '18', '21', '27', '28', '93', '94', '40', '95',
    '41', '53', '54', '62', '101', '63', '65', '66', '67', '98', '99', '103', '104', '70',
    '76', '79', '82', '83', '107', '113', '116', '119', '120', '122', '91'];

  applicableTestTypeIds2: string[] = ['30', '31', '32', '33', '34', '35', '36', '38', '39', '44', '45', '47', '48', '49', '50', '56', '57',
    '59', '60', '85', '86', '87', '88', '89', '90', '100', '121'];

  constructor() {
  }

  ngOnInit() {
  }

}
