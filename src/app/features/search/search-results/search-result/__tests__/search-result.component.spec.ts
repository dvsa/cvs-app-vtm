import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { getRecalls } from '@store/test-records';
import { SearchResultComponent } from '../search-result.component';

describe('SearchResultComponent', () => {
	let component: SearchResultComponent;
	let fixture: ComponentFixture<SearchResultComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchResultComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchResultComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(MockStore);
		fixture.componentRef.setInput('searchResult', {
			systemNumber: '123',
			createdTimestamp: '2026-08-19T12:00:00.000Z',
			vin: '76890',
			techRecord_vehicleType: 'hgv',
			techRecord_statusCode: 'current',
		} as TechRecordSearchSchema);
	});

	it('should start fetching recalls when the technical record is selected', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		component.prefetchRecalls();

		expect(dispatchSpy).toHaveBeenCalledWith(getRecalls({ vin: '76890' }));
	});
});
