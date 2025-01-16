import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReferenceDataResourceType, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { ReplaySubject, filter, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tyres-section-view',
	templateUrl: './tyres-section-view.component.html',
	styleUrls: ['./tyres-section-view.component.scss'],
})
export class TyresSectionViewComponent implements OnDestroy, OnInit {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);
	invalidAxles: Array<number> = [];
	tyreLoadIndexReferenceData: ReferenceDataTyreLoadIndex[] = [];
	referenceDataService = inject(ReferenceDataService);
	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.loadReferenceData();
	}

	ngOnDestroy(): void {
		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	loadReferenceData() {
		this.referenceDataService
			.getAll$(ReferenceDataResourceType.TyreLoadIndex)
			.pipe(filter(Boolean))
			.pipe(takeUntil(this.destroy$))
			.subscribe((tyreLoadIndex) => {
				this.tyreLoadIndexReferenceData = tyreLoadIndex as ReferenceDataTyreLoadIndex[];
			});
	}
}
