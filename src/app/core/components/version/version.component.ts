import { ChangeDetectionStrategy, Component } from '@angular/core';
import packgeJson from '../../../../../package.json';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionComponent {
  public version = packgeJson.version;
}
