import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BannerComponent } from '@components/banner/banner.component';
import { TagComponent } from '@components/tag/tag.component';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@pipes/format-vehicle-type/format-vehicle-type.pipe';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Subject, filter, race, take, withLatestFrom } from 'rxjs';

@Component({
	selector: 'app-batch-vehicle-results',
	templateUrl: './batch-vehicle-results.component.html',
	imports: [
		BannerComponent,
		TagComponent,
		RouterLink,
		AsyncPipe,
		UpperCasePipe,
		DefaultNullOrEmpty,
		FormatVehicleTypePipe,
	],
})
export class BatchVehicleResultsComponent implements OnDestroy {
	technicalRecordService = inject(TechnicalRecordService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	batchTechRecordService = inject(BatchTechnicalRecordService);

	private destroy$ = new Subject<void>();

	constructor() {
		this.batchTechRecordService.batchCount$.pipe(take(1)).subscribe((count) => {
			if (!count) {
				void this.router.navigate(['../..'], { relativeTo: this.route });
			}
		});

		race(
			this.batchTechRecordService.batchCount$.pipe(
				withLatestFrom(this.batchTechRecordService.batchCreatedCount$, this.batchTechRecordService.batchUpdatedCount$),
				filter(([total, created, updated]) => total === created + updated)
			),
			this.destroy$
		)
			.pipe(take(1))
			.subscribe(() => {
				this.technicalRecordService.clearEditingTechRecord();
			});
	}

	ngOnDestroy(): void {
		this.batchTechRecordService.clearBatch();
		this.technicalRecordService.clearSectionTemplateStates();
		this.destroy$.next();
		this.destroy$.complete();
	}

	get vehicleType$() {
		return this.batchTechRecordService.vehicleType$;
	}

	get applicationId$() {
		return this.batchTechRecordService.applicationId$;
	}

	get batchVehiclesSuccess$() {
		return this.batchTechRecordService.batchVehiclesSuccess$;
	}

	get vehicleStatus() {
		return StatusCodes;
	}

	get batchCount$() {
		return this.batchTechRecordService.batchCount$;
	}

	get batchSuccessCount$() {
		return this.batchTechRecordService.batchSuccessCount$;
	}

	get batchTotalCreatedCount$() {
		return this.batchTechRecordService.batchTotalCreatedCount$;
	}

	get batchTotalUpdatedCount$() {
		return this.batchTechRecordService.batchTotalUpdatedCount$;
	}

	get batchCreatedCount$() {
		return this.batchTechRecordService.batchCreatedCount$;
	}

	get batchUpdatedCount$() {
		return this.batchTechRecordService.batchUpdatedCount$;
	}
}
