import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-result-of-test',
  templateUrl: './result-of-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultOfTestComponent {
  constructor(private ref: ChangeDetectorRef, private resultService: ResultOfTestService) {}

  get resultOfTest$() {
    return this.resultService.resultOfTest.pipe(
      distinctUntilChanged(),
      tap(() => this.ref.markForCheck())
    );
  }

  testResultType(result: string): 'red' | 'green' {
    return (<Record<string, 'red' | 'green'>>{ pass: 'green', prs: 'green', fail: 'red' })[result ?? 'pass'];
  }
}
