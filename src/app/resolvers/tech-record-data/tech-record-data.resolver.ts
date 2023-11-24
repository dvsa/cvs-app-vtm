import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';

export const techRecordDataResolver: ResolveFn<boolean> = () => {
  const referenceDataService = inject(ReferenceDataService);
  referenceDataService.loadReferenceData(ReferenceDataResourceType.Tyres);

  return true;
};
