import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/.';
import { ReferenceDataDeleteComponent } from './reference-data-delete.component';

describe('ReferenceDataAddComponent', () => {
  let component: ReferenceDataDeleteComponent;
  let fixture: ComponentFixture<ReferenceDataDeleteComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataDeleteComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        GlobalErrorService,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('handleFormChange', () => {
    it('should change reason for deletion to the form value', () => {
      component.handleFormChange({ reason: 'test reason' });

      expect(component.reasonForDeletion).toEqual({ reason: 'test reason' });
    });
  });
  describe('handleSubmit', () => {
    it('will not dispatch there is no reason for deletion', () => {
      component.type = ReferenceDataResourceType.CountryOfRegistration;
      const dispatch = jest.spyOn(store, 'dispatch');

      component.handleSubmit();

      expect(dispatch).not.toHaveBeenCalledWith({
        reason: 'test reason',
        resourceKey: 'testkey',
        resourceType: 'COUNTRY_OF_REGISTRATION',
        type: '[API/reference-data] deleteReferenceDataItem',
      });
    });
    it('will dispatches if there is a reason and type defined', () => {
      fixture.ngZone?.run(() => {
        component.type = ReferenceDataResourceType.CountryOfRegistration;
        component.key = 'testkey';
        component.handleFormChange({ reason: 'test reason' });
        const dispatch = jest.spyOn(store, 'dispatch');

        component.handleSubmit();

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
});
