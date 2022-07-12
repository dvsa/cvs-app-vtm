import { Component, Input } from '@angular/core';
import { Defects } from '@models/defects';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
})
export class DefectsComponent {
  @Input() isEditing = false;
  @Input() data$?: Observable<Defects | undefined>;

  constructor() {}
}
