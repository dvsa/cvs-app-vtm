import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { YES_NO_NULL_OPTIONS } from '@models/options.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { MultiOptionPipe } from '@pipes/multi-option/multi-option.pipe';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-dda-section-summary',
	templateUrl: './dda-section-summary.component.html',
	styleUrls: ['./dda-section-summary.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, DefaultNullOrEmpty, MultiOptionPipe],
})
export class DDASectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly YES_NO_NULL_OPTIONS = YES_NO_NULL_OPTIONS;
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();
		if (!current || !amended) return true;

		return !isEqual(current[property as keyof TechRecordType<'put'>], amended[property as keyof TechRecordType<'put'>]);
	}
}
