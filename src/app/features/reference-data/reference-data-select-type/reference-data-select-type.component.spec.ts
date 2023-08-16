import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type.component';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';

describe('ReferenceDataComponent', () => {
  let component: ReferenceDataSelectTypeComponent;
  let fixture: ComponentFixture<ReferenceDataSelectTypeComponent>;
  let store: MockStore<State>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataSelectTypeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), ReferenceDataService, { provide: UserService, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReferenceDataSelectTypeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancel', () => {
    it('should navigate back relative to the route', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      component.cancel();

      expect(navigateSpy).toBeCalledWith(['..'], { relativeTo: route });
    });
  });

  describe('navigateTo', () => {
    it('should navigate to the reference data resource type', () => {
      jest.spyOn(router, 'navigate').mockImplementation();
      jest.spyOn(component, 'isFormValid', 'get').mockReturnValueOnce(true);

      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      component.navigateTo(ReferenceDataResourceType.CountryOfRegistration);

      expect(navigateSpy).toBeCalledWith(['COUNTRY_OF_REGISTRATION'], { relativeTo: route });
    });
  });

  describe('isFormValid', () => {
    it('checks the form is valid', () => {
      jest.spyOn(DynamicFormService, 'validate').mockReturnValueOnce();
      component.form.setValue({ referenceType: 'COUNTRY_OF_REGISTRATION' });
      expect(component.isFormValid).toBe(true);
    });
  });
});
