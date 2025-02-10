import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-adr-section-view',
	templateUrl: './adr-section-view.component.html',
	styleUrls: ['./adr-section-view.component.scss'],
})
export class AdrSectionViewComponent {
	store = inject(Store);
	adrService = inject(AdrService);

	techRecord = this.store.selectSignal(techRecord);
}
