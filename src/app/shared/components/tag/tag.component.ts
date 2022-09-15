import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  @Input() type: 'blue' | 'red' | 'green' | 'yellow' = 'blue';
}
