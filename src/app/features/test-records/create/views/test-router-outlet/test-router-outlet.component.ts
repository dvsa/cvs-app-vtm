import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-test-router-outlet',
  templateUrl: './test-router-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRouterOutletComponent {}
