import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/.';
import { of } from 'rxjs';
import { ReferenceDataCreateComponent } from './reference-data-add.component';

const mockRefDataService = {
  loadReferenceData: jest.fn(),
  loadReferenceDataByKey: jest.fn(),
  fetchReferenceDataByKey: jest.fn(),
};

describe('ReferenceDataCreateComponent', () => {
  let component: ReferenceDataCreateComponent;
  let fixture: ComponentFixture<ReferenceDataCreateComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataCreateComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        GlobalErrorService,
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
    fixture.detectChanges();
    component.checkForms = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
