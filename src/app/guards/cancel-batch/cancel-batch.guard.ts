import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AxlesService } from '../../services/axles/axles.service';
import { TechnicalRecordService } from '../../services/technical-record/technical-record.service';
import { clearBatch } from '../../store/technical-records/batch-create.actions';

export const cancelBatchGuard: CanDeactivateFn<boolean> = () => {
	const store = inject(Store);
	const axlesService = inject(AxlesService);
	const technicalRecordService = inject(TechnicalRecordService);
	axlesService.reset();
	technicalRecordService.clearEditingTechRecord();
	technicalRecordService.clearSectionTemplateStates();
	store.dispatch(clearBatch());
	return true;
};
