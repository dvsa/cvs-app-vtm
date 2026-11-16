import { SpinnerComponent } from '@/src/app/core/components/spinner/spinner.component';
import { Roles } from '@/src/app/models/roles.enum';
import { LoadingService } from '@/src/app/services/loading/loading.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState, reducers } from '@/src/app/store';
import { setSpinnerState } from '@/src/app/store/spinner/spinner.actions';
import { TechSearchResultsEffects } from '@/src/app/store/tech-record-search/tech-record-search.effect';
import { AsyncPipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { provideEffects } from '@ngrx/effects';
import { Store, provideStore } from '@ngrx/store';
import { of } from 'rxjs';
import { SearchComponent } from '../../search/search.component';
import { SearchResultsComponent } from '../search-results.component';

@Component({
	imports: [AsyncPipe, SpinnerComponent, RouterOutlet],
	template: `
		<app-spinner [loading]="loading.showSpinner$ | async" />
		<router-outlet />
	`,
})
class SearchLoadingHostComponent {
	constructor(readonly loading: LoadingService) {}
}

describe('Search loading', () => {
	it.each([
		{ outcome: 'empty results', records: [], status: 200 },
		{
			outcome: 'matching records',
			records: [
				{
					systemNumber: '123',
					createdTimestamp: '2026-01-01T00:00:00.000Z',
					techRecord_statusCode: 'current',
					techRecord_vehicleType: 'hgv',
					vin: 'VIN123456789',
					primaryVrm: 'ABC123',
					techRecord_manufactureYear: 2020,
				},
			] satisfies TechRecordSearchSchema[],
			status: 200,
		},
		{ outcome: 'not found', records: [], status: 404 },
		{ outcome: 'API failure', records: [], status: 500 },
	])(
		'should keep the spinner visible through navigation and the request until $outcome',
		async ({ records, status }) => {
			let loadResults!: (component: typeof SearchResultsComponent) => void;
			const resultsComponent = new Promise<typeof SearchResultsComponent>((resolve) => {
				loadResults = resolve;
			});
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideHttpClientTesting(),
					provideStore(reducers, { initialState: initialAppState }),
					provideEffects(TechSearchResultsEffects),
					provideRouter([
						{ path: 'search', component: SearchComponent },
						{ path: 'search/results', loadComponent: () => resultsComponent },
					]),
					{ provide: UserService, useValue: { roles$: of(Roles.TechRecordView.split(',')) } },
				],
			});
			const fixture = TestBed.createComponent(SearchLoadingHostComponent);
			const router = TestBed.inject(Router);
			const store = TestBed.inject(Store);
			const http = TestBed.inject(HttpTestingController);
			fixture.autoDetectChanges();
			await router.navigateByUrl('/search');
			await fixture.whenStable();

			store.dispatch(setSpinnerState({ showSpinner: true }));
			const navigation = router.navigateByUrl('/search/results?searchTerm=ABC123&searchCriteria=primaryVrm');
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
			store.dispatch(setSpinnerState({ showSpinner: false }));
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('[role="progressbar"]')).not.toBeNull();

			loadResults(SearchResultsComponent);
			await navigation;
			fixture.detectChanges();
			const request = http.expectOne((req) => req.url.endsWith('/tech-records/v4/search/ABC123'));
			store.dispatch(setSpinnerState({ showSpinner: false }));
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('[role="progressbar"]')).not.toBeNull();
			expect(fixture.nativeElement.querySelector('#no-records-found')).toBeNull();

			request.flush(records, { status, statusText: status === 200 ? 'OK' : 'Error' });
			await fixture.whenStable();
			expect(fixture.nativeElement.querySelector('[role="progressbar"]')).toBeNull();
			expect(fixture.nativeElement.querySelectorAll('app-search-result')).toHaveLength(records.length);
			expect(fixture.nativeElement.querySelectorAll('#no-records-found')).toHaveLength(
				(status === 200 && records.length === 0) || status === 404 ? 1 : 0
			);
			http.verify();
		}
	);
});
