import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TestResultModel } from '@models/test-result.model';
import { TestResultsService } from '@services/test-results/test-results.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss']
})
export class TestResultComponent {
  testResult$?: Observable<TestResultModel | undefined>;

  constructor(private testResultsService: TestResultsService, private titleService: Title) {
    this.testResult$ = this.testResultsService.testResult$;
  }
}
