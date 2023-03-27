import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-certificate[testNumber][vin]',
  templateUrl: './test-certificate.component.html',
  styleUrls: ['./test-certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestCertificateComponent {
  @Input() testNumber!: string;
  @Input() vin!: string;
  @Input() isClickable = true;

  get documentParams(): Map<string, string> {
    return new Map([
      ['testNumber', this.testNumber],
      ['vinNumber', this.vin]
    ]);
  }

  get fileName(): string {
    return `${this.testNumber}_${this.vin}`;
  }
}
