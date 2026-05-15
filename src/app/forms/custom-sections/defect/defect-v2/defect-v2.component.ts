import { TestService } from '@/src/app/services/test/test.service';
import { selectRouteDataProperty, selectRouteParam } from '@/src/app/store/router/router.selectors';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-v2',
	templateUrl: './defect-v2.component.html',
	styleUrls: ['./defect-v2.component.scss'],
})
export class DefectV2Component {
	store = inject(Store);
	testService = inject(TestService);

	defectRef = this.store.selectSignal(selectRouteParam('ref'));
	defectIndex = this.store.selectSignal(selectRouteParam('defectIndex'));
	isEditing = this.store.selectSignal(selectRouteDataProperty('isEditing'));
}
