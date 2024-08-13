import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { techRecordDataResolver } from './tech-record-data.resolver';

describe('techRecordDataResolver', () => {
	let referenceDataService: ReferenceDataService;

	const routeSnapshot = {} as ActivatedRouteSnapshot;
	const routerStateSnapshot = {} as RouterStateSnapshot;

	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() => techRecordDataResolver(...resolverParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{ provide: ReferenceDataService, useValue: { loadReferenceData: jest.fn() } }],
		});
		referenceDataService = TestBed.inject(ReferenceDataService);
	});

	it('should be created', () => {
		expect(executeResolver).toBeTruthy();
	});

	it('should attempt to load the tyres ref data', () => {
		const spy = jest.spyOn(referenceDataService, 'loadReferenceData');
		void executeResolver(routeSnapshot, routerStateSnapshot);
		expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.Tyres);
	});

	it('should attempt to load the tyres load index ref data', () => {
		const spy = jest.spyOn(referenceDataService, 'loadReferenceData');
		void executeResolver(routeSnapshot, routerStateSnapshot);
		expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.TyreLoadIndex);
	});
});
