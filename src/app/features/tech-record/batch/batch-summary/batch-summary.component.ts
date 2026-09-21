import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { BatchUpdateVehicleModel, StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import {
	selectBatchCreatedCount,
	selectBatchCreatedSuccessCount,
	selectBatchDetails,
	selectBatchFailed,
	selectBatchFailedCount,
	selectBatchPending,
	selectBatchPendingCount,
	selectBatchSuccess,
	selectBatchSuccessCount,
	selectBatchUpdatedCount,
	selectBatchUpdatedSuccessCount,
	selectBatchVehicleTypeDescriptor,
	selectCompleteBatchVehicles,
} from '@/src/app/store/batch/batch.selectors';
import { createVehicleRecord, editingTechRecord, updateTechRecord } from '@/src/app/store/technical-records';
import { nullADRDetails } from '@/src/app/store/technical-records/technical-record-service.reducer';
import { PercentPipe, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-batch-summary',
	templateUrl: './batch-summary.component.html',
	styleUrls: ['./batch-summary.component.scss'],
	imports: [BannerComponent, RouterLink, UpperCasePipe, TagComponent, DefaultNullOrEmpty, PercentPipe, ButtonComponent],
})
export class BatchSummaryComponent {
	readonly store = inject(Store);
	readonly router = inject(Router);
	readonly errorService = inject(GlobalErrorService);

	readonly techRecord = this.store.selectSignal(editingTechRecord);
	readonly completeBatchVehicles = this.store.selectSignal(selectCompleteBatchVehicles);
	readonly batchDetails = this.store.selectSignal(selectBatchDetails);
	readonly batchPending = this.store.selectSignal(selectBatchPending);
	readonly batchPendingCount = this.store.selectSignal(selectBatchPendingCount);
	readonly batchSuccess = this.store.selectSignal(selectBatchSuccess);
	readonly batchSuccessCount = this.store.selectSignal(selectBatchSuccessCount);
	readonly batchFailed = this.store.selectSignal(selectBatchFailed);
	readonly batchFailedCount = this.store.selectSignal(selectBatchFailedCount);
	readonly batchCreatedCount = this.store.selectSignal(selectBatchCreatedCount);
	readonly batchCreatedSuccessCount = this.store.selectSignal(selectBatchCreatedSuccessCount);
	readonly batchUpdatedCount = this.store.selectSignal(selectBatchUpdatedCount);
	readonly batchUpdatedSuccessCount = this.store.selectSignal(selectBatchUpdatedSuccessCount);
	readonly batchVehicleTypeDescriptor = this.store.selectSignal(selectBatchVehicleTypeDescriptor);

	readonly TagType = TagType;
	readonly StatusCodes = StatusCodes;
	readonly VehicleTypes = VehicleTypes;

	goBackToHomePage(): void {
		this.router.navigate(['/']);
	}

	handleRetryFailed(): void {
		const techRecord = this.techRecord();
		if (!techRecord) return;

		this.errorService.clearErrors();

		const batchFailed = this.batchFailed();
		for (const vehicle of batchFailed) {
			const record = {
				...techRecord,
				vin: vehicle.vin,
				systemNumber: vehicle.systemNumber,
				createdTimestamp: vehicle.createdTimestamp,
			} as BatchUpdateVehicleModel;

			if (record.techRecord_vehicleType === VehicleTypes.TRL && vehicle.trailerIdOrVrm) {
				record.trailerId = vehicle.trailerIdOrVrm;
			}

			if (record.techRecord_vehicleType !== VehicleTypes.TRL && vehicle.trailerIdOrVrm) {
				record.primaryVrm = vehicle.trailerIdOrVrm;
			}

			if (record.systemNumber) {
				this.store.dispatch(
					updateTechRecord({
						systemNumber: record.systemNumber,
						createdTimestamp: record.createdTimestamp,
						groupType: 'batch',
						batchRecordId: vehicle.id,
					})
				);
			}

			if (!record.systemNumber) {
				const cleansedRecord = nullADRDetails(record as TechRecordType<'put'>);
				this.store.dispatch(createVehicleRecord({ vehicle: cleansedRecord }));
			}
		}
	}
}
