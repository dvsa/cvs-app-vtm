import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { BatchUpdateVehicleModel, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { createVehicleRecord, editingTechRecord, updateTechRecord } from '@/src/app/store/technical-records';
import { selectBatchDetails } from '@/src/app/store/technical-records/batch-create.selectors';
import { nullADRDetails } from '@/src/app/store/technical-records/technical-record-service.reducer';
import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { TechRecordComponent } from '../../components/tech-record/tech-record.component';
import { BatchTechRecordDetailsSummaryCardComponent } from './batch-tech-record-details-summary-card/batch-tech-record-details-summary-card.component';

@Component({
	selector: 'app-enter-tech-record-details',
	templateUrl: './enter-tech-record-details.component.html',
	styleUrls: ['./enter-tech-record-details.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		TechRecordComponent,
		ButtonGroupComponent,
		ButtonComponent,
		BatchTechRecordDetailsSummaryCardComponent,
	],
})
export class EnterTechRecordDetailsComponent {
	readonly store = inject(Store);
	readonly router = inject(Router);
	readonly errorService = inject(GlobalErrorService);
	readonly technicalRecordService = inject(TechnicalRecordService);

	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);
	readonly techRecord = this.store.selectSignal(editingTechRecord);
	readonly techRecordComponent = viewChild(TechRecordComponent);

	handleSave(): void {
		const techRecord = this.techRecord();
		const techRecordComponent = this.techRecordComponent();
		if (!techRecord || !techRecordComponent) return;

		const form = techRecordComponent.form;
		form.markAllAsTouched();

		const errors = this.errorService.extractGlobalErrors(form);
		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		if (errors.length === 0) {
			const savedBatchDetails = this.savedBatchDetails();
			for (const vehicle of savedBatchDetails.vehicles) {
				// Skip empty vehicles
				if (!vehicle.vin) continue;

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

				const cleansedRecord = nullADRDetails(record as TechRecordType<'put'>);

				if (record.systemNumber) {
					this.technicalRecordService.updateEditingTechRecord(cleansedRecord);
					this.store.dispatch(
						updateTechRecord({
							systemNumber: record.systemNumber,
							createdTimestamp: record.createdTimestamp,
							groupType: 'batch',
						})
					);
				}

				if (!record.systemNumber) {
					this.store.dispatch(createVehicleRecord({ vehicle: cleansedRecord }));
				}

				this.technicalRecordService.clearSectionTemplateStates();
				this.router.navigate([RootRoutes.BATCH, BatchRoutes.BATCH_SUMMARY]);
			}
		}
	}
}
