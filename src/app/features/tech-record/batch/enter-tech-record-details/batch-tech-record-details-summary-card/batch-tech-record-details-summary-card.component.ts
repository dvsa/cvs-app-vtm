import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { selectBatchDetails } from '@/src/app/store/technical-records/batch-create.selectors';
import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-batch-tech-record-details-summary-card',
	templateUrl: './batch-tech-record-details-summary-card.component.html',
	styleUrls: ['./batch-tech-record-details-summary-card.component.scss'],
	imports: [TagComponent, DefaultNullOrEmpty, RouterLink, UpperCasePipe],
})
export class BatchTechRecordDetailsSummaryCardComponent {
	readonly store = inject(Store);

	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);

	readonly TagType = TagType;
	readonly RootRoutes = RootRoutes;
	readonly BatchRoutes = BatchRoutes;
	readonly StatusCodes = StatusCodes;
	readonly VehicleTypes = VehicleTypes;
}
