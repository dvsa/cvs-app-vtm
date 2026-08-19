import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { getRecalls } from '@store/test-records';
import { ReplaySubject, of } from 'rxjs';
import { SingleSearchResultComponent } from '../single-search-result.component';

describe('SingleSearchResultComponent', () => {
	let component: SingleSearchResultComponent;
	let fixture: ComponentFixture<SingleSearchResultComponent>;
	let store: MockStore;
	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SingleSearchResultComponent, RoleRequiredDirective],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{
					provide: UserService,
					useValue: {
						roles$: of(['TechRecord.View']),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SingleSearchResultComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(MockStore);
		fixture.componentRef.setInput('searchResult', {
			systemNumber: '123',
			createdTimestamp: '123',
			vin: '76890',
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: 'current',
			techRecord_manufactureYear: 1998,
		});
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should start fetching recalls when the technical record is selected', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		component.prefetchRecalls();

		expect(dispatchSpy).toHaveBeenCalledWith(getRecalls({ vin: '76890' }));
	});
});
