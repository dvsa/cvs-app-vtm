import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { techRecord } from '@store/technical-records';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-adr-section-view',
	templateUrl: './adr-section-view.component.html',
	styleUrls: ['./adr-section-view.component.scss'],
	imports: [PaginationComponent, DatePipe, DefaultNullOrEmpty],
})
export class AdrSectionViewComponent {
	store = inject(Store);
	adrService = inject(AdrService);

	techRecord = this.store.selectSignal(techRecord);
}
