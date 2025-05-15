import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { createSelector } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import * as refSelectors from '@store/reference-data/reference-data.selectors';
import { of } from 'rxjs';
import { ReferenceDataListComponent } from '../reference-data-list.component';

describe('DataTypeListComponent', () => {
	let component: ReferenceDataListComponent;
	let fixture: ComponentFixture<ReferenceDataListComponent>;
	let router: Router;
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReferenceDataListComponent, RoleRequiredDirective],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				GlobalErrorService,
				{ provide: UserService, useValue: { roles$: of([Roles.ReferenceDataView]) } },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReferenceDataListComponent);
		component = fixture.componentInstance;
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		errorService = TestBed.inject(GlobalErrorService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('amend', () => {
		it('should navigate to the selected items key', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');

				component.amend({ resourceKey: 'foo', resourceType: ReferenceDataResourceType.CountryOfRegistration });

				expect(navigateSpy).toHaveBeenCalledWith(['foo'], { relativeTo: route });
			});
		});
	});
	describe('delete', () => {
		it('should navigate to the selected items :key/delete', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');

				component.delete({ resourceKey: 'foo', resourceType: ReferenceDataResourceType.CountryOfRegistration });

				expect(navigateSpy).toHaveBeenCalledWith(['foo/delete'], { relativeTo: route });
			});
		});
	});
	describe('addNew', () => {
		it('should navigate to the selected items create', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');

				component.addNew();

				expect(navigateSpy).toHaveBeenCalledWith(['create'], { relativeTo: route });
			});
		});
	});
	describe('navigateToDeletedItems', () => {
		it('should navigate to the selected items create', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');

				component.navigateToDeletedItems();

				expect(navigateSpy).toHaveBeenCalledWith(['deleted-items'], { relativeTo: route });
			});
		});
	});
	describe('handlePaginationChange', () => {
		it('should set the start and end pages', () => {
			component.handlePaginationChange({ start: 0, end: 24 });

			expect(component.pageStart).toBe(0);
			expect(component.pageEnd).toBe(24);
		});
	});
	describe('clear', () => {
		it('should reset the form', () => {
			component.form.controls['term'].patchValue('foo');
			expect(component.form.controls['term'].value).toBe('foo');

			component.clear();
			expect(component.form.controls['term'].value).toBeNull();
		});
		it('should navigate to page 1 of pagination', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');
				component.type = ReferenceDataResourceType.Tyres;
				component.searchReturned = true;
				component.clear();

				expect(navigateSpy).toHaveBeenCalledWith(['../TYRES'], {
					relativeTo: route,
					queryParams: { 'reference-data-items-page': 1 },
				});
			});
		});
	});

	describe('search', () => {
		it('should call add error if there is no search term', () => {
			const errorSpy = jest.spyOn(errorService, 'addError');
			component.search('', 'tyreCode' as keyof ReferenceDataModelBase);

			expect(errorSpy).toHaveBeenCalled();
		});
		it('should call add error if there is no filter', () => {
			const errorSpy = jest.spyOn(errorService, 'addError');
			component.search('term', '' as keyof ReferenceDataModelBase);

			expect(errorSpy).toHaveBeenCalled();
		});
		it('should call add error if there are no items returned', () => {
			const errorSpy = jest.spyOn(errorService, 'addError');
			component.type = ReferenceDataResourceType.Tyres;

			component.search('term', 'brakeCode' as keyof ReferenceDataModelBase);

			expect(errorSpy).toHaveBeenCalled();
		});
		it('should navigate to page 1 of pagination', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');
				component.type = ReferenceDataResourceType.Tyres;
				component.searchReturned = true;
				jest.spyOn(refSelectors, 'selectRefDataBySearchTerm').mockReturnValue(
					createSelector(
						(v) => v,
						() => [{ resourceKey: 'foo', resourceType: 'bar' } as unknown as ReferenceDataModelBase]
					)
				);
				component.search('foo', 'bar' as keyof ReferenceDataModelBase);

				expect(navigateSpy).toHaveBeenCalledWith(['../TYRES'], {
					relativeTo: route,
					queryParams: { 'reference-data-items-page': 1 },
				});
			});
		});
	});
});
