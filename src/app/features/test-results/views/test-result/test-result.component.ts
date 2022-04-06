import { Component } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { Store } from '@ngrx/store';
import { TestResultsService } from '@services/test-results/test-results.service';
import { State } from '@store/.';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss']
})
export class TestResultComponent {
  testResult$?: Observable<TestResultModel | undefined>;

  constructor(private testResultsService: TestResultsService) {
    this.testResult$ = this.testResultsService.testResult$;
  }
}
