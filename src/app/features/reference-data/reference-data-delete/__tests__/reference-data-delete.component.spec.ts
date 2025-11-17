import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { ReferenceDataDeleteComponent } from '../reference-data-delete.component';

describe('ReferenceDataDeleteComponent', () => {
	let component: ReferenceDataDeleteComponent;
	let fixture: ComponentFixture<ReferenceDataDeleteComponent>;
	let store: MockStore<State>;
	let router: Router;
	let route: ActivatedRoute;
	let errorService: GlobalErrorService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReferenceDataDeleteComponent],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: {} },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(ReferenceDataDeleteComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		route = TestBed.inject(ActivatedRoute);
		errorService = TestBed.inject(GlobalErrorService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('back', () => {
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.back();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.back();

			expect(navigateSpy).toHaveBeenCalledWith(['../..'], { relativeTo: route });
		});
	});

	describe('submit', () => {
		it('will not dispatch there is no reason for deletion', () => {
			fixture.componentRef.setInput('type', ReferenceDataResourceType.CountryOfRegistration);
			component.form.patchValue({ reason: '' });
			const dispatch = jest.spyOn(store, 'dispatch');

			component.submit();

			expect(dispatch).not.toHaveBeenCalledWith({
				reason: 'test reason',
				resourceKey: 'testkey',
				resourceType: 'COUNTRY_OF_REGISTRATION',
				type: '[API/reference-data] deleteReferenceDataItem',
			});
		});
		it('will dispatches if there is a reason and type defined', () => {
			fixture.componentRef.setInput('type', ReferenceDataResourceType.CountryOfRegistration);
			fixture.componentRef.setInput('key', 'testkey');
			component.form.patchValue({ reason: 'test reason' });

			const dispatch = jest.spyOn(store, 'dispatch');

			component.submit();

			expect(dispatch).toHaveBeenCalled();
			expect(dispatch).toHaveBeenCalledWith({
				reason: 'test reason',
				resourceKey: 'testkey',
				resourceType: 'COUNTRY_OF_REGISTRATION',
				type: '[API/reference-data] deleteReferenceDataItem',
			});
		});
	});
});
