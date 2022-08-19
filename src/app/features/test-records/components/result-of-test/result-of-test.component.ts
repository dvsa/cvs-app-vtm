import { Component } from '@angular/core';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';

@Component({
  selector: 'app-result-of-test',
  templateUrl: './result-of-test.component.html'
})
export class ResultOfTestComponent {
  constructor(private resultService: ResultOfTestService) {}
  get resultOfTest$() {
    return this.resultService.resultOfTest;
  }
}
