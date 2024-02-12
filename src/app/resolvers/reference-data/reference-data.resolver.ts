import { ActivatedRouteSnapshot, Params, ResolveFn } from '@angular/router';
import { take } from 'rxjs';
import { fetchReferenceDataAudit } from '@store/reference-data';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { inject } from '@angular/core';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';

export const referenceDataResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store: Store<State> = inject(Store<State>);
  const referenceDataService: ReferenceDataService = inject(ReferenceDataService);
  route.parent?.params['pipe'](take(1)).subscribe((params: Params) => {
    // eslint-disable-next-line prefer-destructuring
    const type = params['type'];
    referenceDataService.loadReferenceDataByKey(route.params['referenceData'], type);
    store.dispatch(fetchReferenceDataAudit({ resourceType: (`${type}#AUDIT`) as ReferenceDataResourceType }));
  });
  return true;
};
