import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@api/reference-data';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/.';
import { ReferenceDataAmendComponent } from './reference-data-amend.component';

const mockRefDataService = {
  loadReferenceData: jest.fn(),
  loadReferenceDataByKey: jest.fn(),
  fetchReferenceDataByKey: jest.fn(),
};

describe('ReferenceDataAmendComponent', () => {
  let component: ReferenceDataAmendComponent;
  let fixture: ComponentFixture<ReferenceDataAmendComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataAmendComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataService,
        { provide: UserService, useValue: {} },
        { provide: ReferenceDataService, useValue: mockRefDataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReferenceDataAmendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleFormChange', () => {
    it('should set amendedData', () => {
      component.handleFormChange({ foo: 'bar' });

      expect(component.amendedData).toEqual({ foo: 'bar' });
    });
  });

  describe('handleSubmit', () => {
    it('should dispatch if form is valid', () => {
      fixture.ngZone?.run(() => {
        component.amendedData = { description: 'testing' };
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
  });
});
