import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { of } from 'rxjs';
import { ReferenceDataCreateComponent } from '../reference-data-add.component';

const mockRefDataService = {
	loadReferenceData: jest.fn(),
	loadReferenceDataByKey: jest.fn(),
	fetchReferenceDataByKey: jest.fn(),
};

describe('ReferenceDataCreateComponent', () => {
	let component: ReferenceDataCreateComponent;
	let fixture: ComponentFixture<ReferenceDataCreateComponent>;
	let store: MockStore<State>;
	let router: Router;
	let route: ActivatedRoute;
	let errorService: GlobalErrorService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReferenceDataCreateComponent],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: {} },
				{ provide: ReferenceDataService, useValue: mockRefDataService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(ReferenceDataCreateComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		fixture.detectChanges();
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		fixture.detectChanges();
		component.checkForms = jest.fn();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('navigateBack', () => {
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.navigateBack();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigateBack();

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});
	});

	describe('handleFormChange', () => {
		it('should set newRefData', () => {
			component.handleFormChange({ foo: 'bar' });

			expect(component.newRefData).toEqual({ foo: 'bar' });
		});
	});

	describe('handleSubmit', () => {
		it('should dispatch if form is valid', () => {
			fixture.ngZone?.run(() => {
				component.newRefData = { description: 'test' };
				jest.spyOn(component, 'checkForms').mockImplementationOnce(() => {
					component.isFormInvalid = false;
				});
				const dispatch = jest.spyOn(store, 'dispatch');

				component.handleSubmit();

				expect(dispatch).toHaveBeenCalled();
			});
		});
		it('should not dispatch if form is invalid', () => {
			jest.spyOn(component, 'checkForms').mockImplementationOnce(() => {
				component.isFormInvalid = true;
			});
			const dispatch = jest.spyOn(store, 'dispatch');

			component.handleSubmit();

			expect(dispatch).not.toHaveBeenCalled();
		});
		it('should not dispatch if ref data already exists', () => {
			jest.spyOn(mockRefDataService, 'fetchReferenceDataByKey').mockReturnValueOnce(of({ foo: 'bar' }));

			const dispatch = jest.spyOn(store, 'dispatch');

			component.handleSubmit();

			expect(dispatch).not.toHaveBeenCalled();
		});
	});
});
