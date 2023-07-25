import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { ReferenceDataListComponent } from './reference-data-list.component';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { addError } from '@store/global-error/actions/global-error.actions';
import { GlobalErrorComponent } from '@core/components/global-error/global-error.component';
import * as refSelectors from '../../../store/reference-data/selectors/reference-data.selectors';
import { of } from 'rxjs';
import { createSelector } from '@ngrx/store';

describe('DataTypeListComponent', () => {
  let component: ReferenceDataListComponent;
  let fixture: ComponentFixture<ReferenceDataListComponent>;
  let store: MockStore<State>;
  let router: Router;
  let errorService: GlobalErrorService;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataService,
        GlobalErrorService,
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataListComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    errorService = TestBed.inject(GlobalErrorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('amend', () => {
    it('should navigate to the selected items key', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.amend({ resourceKey: 'foo', resourceType: ReferenceDataResourceType.CountryOfRegistration });

      expect(navigateSpy).toBeCalledWith(['foo'], { relativeTo: route });
    });
  });
  describe('delete', () => {
    it('should navigate to the selected items :key/delete', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.delete({ resourceKey: 'foo', resourceType: ReferenceDataResourceType.CountryOfRegistration });

      expect(navigateSpy).toBeCalledWith(['foo/delete'], { relativeTo: route });
    });
  });
  describe('addNew', () => {
    it('should navigate to the selected items create', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.addNew();

      expect(navigateSpy).toBeCalledWith(['create'], { relativeTo: route });
    });
  });
  describe('navigateToDeletedItems', () => {
    it('should navigate to the selected items create', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.navigateToDeletedItems();

      expect(navigateSpy).toBeCalledWith(['deleted-items'], { relativeTo: route });
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
      expect(component.form.controls['term'].value).toBe(null);
    });
    it('should reset the start and end page if search returned is true', () => {
      component.handlePaginationChange({ start: 13, end: 17 });
      expect(component.pageStart).toBe(13);
      expect(component.pageEnd).toBe(17);

      component.searchReturned = true;
      component.clear();

      expect(component.pageStart).toBe(0);
      expect(component.pageEnd).toBe(24);
    });
    it('should not reset start and end page if search returned is false', () => {
      component.handlePaginationChange({ start: 13, end: 17 });
      expect(component.pageStart).toBe(13);
      expect(component.pageEnd).toBe(17);

      component.searchReturned = false;
      component.clear();

      expect(component.pageStart).toBe(13);
      expect(component.pageEnd).toBe(17);
    });
  });

  describe('search', () => {
    it('it should call add error if there is no search term', () => {
      const errorSpy = jest.spyOn(errorService, 'addError');
      component.search('', 'tyreCode');

      expect(errorSpy).toBeCalled();
    });
    it('it should call add error if there is no filter', () => {
      const errorSpy = jest.spyOn(errorService, 'addError');
      component.search('term', '');

      expect(errorSpy).toBeCalled();
    });
    it('should call set data', () => {
      const storeSpy = jest.spyOn(refSelectors, 'selectRefDataBySearchTerm').mockReturnValue(
        createSelector(
          v => v,
          () => [{ resourceKey: 'foo', resourceType: 'bar' }]
        )
      );

      component.search('term ', 'tyreCode');

      expect(component.data).toEqual([{ resourceKey: 'foo', resourceType: 'bar' }]);
    });
  });
});
