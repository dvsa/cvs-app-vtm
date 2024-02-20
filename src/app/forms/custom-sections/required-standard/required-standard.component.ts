import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
  selector: 'app-required-standard',
  templateUrl: './required-standard.component.html',
  providers: [DefaultNullOrEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequiredStandardComponent {
}
