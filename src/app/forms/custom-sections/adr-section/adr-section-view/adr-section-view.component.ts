import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { AdrService } from '@services/adr/adr.service';
import { techRecord } from '@store/technical-records';
import _ from 'lodash';

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

	sortAdditionalExaminerNotes(notes?: AdditionalExaminerNotes[] | null) {
		if (!notes) return [];

		return _.orderBy(notes, ['createdAtDate'], ['desc']);
	}
}
