import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YES_NO_NULL_OPTIONS } from '@models/options.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { MultiOptionPipe } from '@pipes/multi-option/multi-option.pipe';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord } from '@store/technical-records';

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
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);
}
