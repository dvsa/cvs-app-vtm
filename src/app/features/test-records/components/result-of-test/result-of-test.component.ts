import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-of-test',
  templateUrl: './result-of-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultOfTestComponent {
  @Input() resultOfTest?: string;

  testResultType(result: string): 'red' | 'green' | 'blue' {
    return (<Record<string, 'red' | 'green' | 'blue'>>{ pass: 'green', prs: 'blue', fail: 'red' })[result ?? 'pass'];
  }
}
