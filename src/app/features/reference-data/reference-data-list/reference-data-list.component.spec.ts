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

describe('DataTypeListComponent', () => {
  let component: ReferenceDataListComponent;
  let fixture: ComponentFixture<ReferenceDataListComponent>;
  let store: MockStore<State>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), ReferenceDataService, { provide: UserService, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataListComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
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
});
