import { Component } from '@angular/core';
import { TestResultsService } from '@services/test-results/test-results.service';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent {
  constructor(private testResultsService: TestResultsService) {
    this.testResultsService.loadTestResultBySystemId('SYS001');
  }
}
