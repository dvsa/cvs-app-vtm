import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@pipes/format-vehicle-type/format-vehicle-type.pipe';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { selectQueryParams } from '@store/router/router.selectors';
import { BehaviorSubject, ReplaySubject, firstValueFrom, of } from 'rxjs';
import { SingleSearchResultComponent } from '../../single-search-result/single-search-result.component';
import { MultipleSearchResultsComponent } from '../multiple-search-results.component';

describe('MultipleSearchResultsComponent', () => {
	let component: MultipleSearchResultsComponent;
	let fixture: ComponentFixture<MultipleSearchResultsComponent>;
	let store: MockStore<State>;
	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				SingleSearchResultComponent,
				MultipleSearchResultsComponent,
				RoleRequiredDirective,
				DefaultNullOrEmpty,
				FormatVehicleTypePipe,
			],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{
					provide: UserService,
					useValue: {
						roles$: of(['TechRecord.View', 'TechRecord.Create']),
					},
				},
			],
		}).compileComponents();
	});

	describe('default tests', () => {
		beforeEach(() => {
			store = TestBed.inject(MockStore);
			store.overrideSelector(selectQueryParams, { vin: '123456' });

			fixture = TestBed.createComponent(MultipleSearchResultsComponent);
			component = fixture.componentInstance;

			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should show create link when searchResults is null', () => {
			const button = fixture.debugElement.query(By.css('.govuk-link'));
			expect(button).toBeTruthy();
		});

		it('should navigate back when searchResults not null', fakeAsync(() => {
			const navigateBackSpy = jest.spyOn(component, 'navigateBack');
			const newData: TechRecordSearchSchema[] = [
				{
					vin: '1B7GG36N12S678410',
					techRecord_statusCode: 'provisional',
					techRecord_vehicleType: 'psv',
					createdTimestamp: '2023-09-27T12:00:00Z',
					systemNumber: '12345',
					techRecord_manufactureYear: 2013,
				},
			];
			component.searchResults$ = new BehaviorSubject<TechRecordSearchSchema[] | undefined>(newData);
			fixture.detectChanges();

			const button = fixture.debugElement.query(By.css('.govuk-back-link'));
			expect(button).toBeTruthy();
			(button.nativeElement as HTMLButtonElement).click();

			tick();

			expect(navigateBackSpy).toHaveBeenCalled();
		}));
	});

	describe('searching', () => {
		beforeEach(() => {
			store = TestBed.inject(MockStore);
		});

		it('should search using a vin', async () => {
			store.overrideSelector(selectQueryParams, { vin: '123456' });

			fixture = TestBed.createComponent(MultipleSearchResultsComponent);
			component = fixture.componentInstance;
			const searchResult = await firstValueFrom(component.searchResults$);

			expect(searchResult).toBeDefined();
		});

		it('should search using a partial vin', async () => {
			store.overrideSelector(selectQueryParams, { partialVin: '123456' });

			fixture = TestBed.createComponent(MultipleSearchResultsComponent);
			component = fixture.componentInstance;
			const searchResult = await firstValueFrom(component.searchResults$);

			expect(searchResult).toBeDefined();
		});

		it('should search using a vrm', async () => {
			store.overrideSelector(selectQueryParams, { vrm: '123456' });

			fixture = TestBed.createComponent(MultipleSearchResultsComponent);
			component = fixture.componentInstance;
			const searchResult = await firstValueFrom(component.searchResults$);

			expect(searchResult).toBeDefined();
		});

		it('should search using a trailer id', async () => {
			store.overrideSelector(selectQueryParams, { trailerId: '123456' });

			fixture = TestBed.createComponent(MultipleSearchResultsComponent);
			component = fixture.componentInstance;
			const searchResult = await firstValueFrom(component.searchResults$);

			expect(searchResult).toBeDefined();
		});
	});
});
