import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

type ADRTechRecord = TechRecordType<'hgv' | 'trl' | 'lgv'> & {
	techRecord_adrDetails_additionalExaminerNotes_note: string;
};

@Component({
	selector: 'app-adr-section-summary',
	templateUrl: './adr-section-summary.component.html',
	styleUrls: ['./adr-section-summary.component.scss'],
	imports: [PaginationComponent, DatePipe, DefaultNullOrEmpty],
})
export class AdrSectionSummaryComponent {
	store = inject(Store);
	adrService = inject(AdrService);
	tcs = inject(TechnicalRecordChangesService);

	currentTechRecord = this.store.selectSignal(techRecord) as Signal<ADRTechRecord>;
	amendedTechRecord = this.store.selectSignal(editingTechRecord) as Signal<ADRTechRecord>;

	hasUNNumberChanged(index: number) {
		const current = this.currentTechRecord() as ADRTechRecord;
		const amended = this.amendedTechRecord() as ADRTechRecord;
		if (!current || !amended) return true;

		return !isEqual(
			current.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo?.[index],
			amended.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo?.[index]
		);
	}
}
