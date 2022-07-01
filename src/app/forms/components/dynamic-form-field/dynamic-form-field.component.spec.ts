import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState, State } from '@store/.';
import { of } from 'rxjs';
import { DynamicFormFieldComponent } from './dynamic-form-field.component';

describe('DynamicFormFieldComponent', () => {
  let component: DynamicFormFieldComponent;
  let fixture: ComponentFixture<DynamicFormFieldComponent>;
  let mockStore: MockStore<State>;
  let service: ReferenceDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormFieldComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [ReferenceDataService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
    service = TestBed.inject(ReferenceDataService);
    mockStore = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get options', () => {
    const options = component.options;
    expect(options).toBeTruthy();
  });

  it('should return the metadata options', (done) => {
    component.control = {
      key: 'birthday',
      value: new CustomFormControl({ name: 'test', type: FormNodeTypes.CONTROL, options: [{ value: '1', label: 'test' }] })
    };
    component.form = new FormGroup({});
    component.options.subscribe((value) => {
      expect(value).toBeTruthy();
      expect(value).toEqual([{ value: '1', label: 'test' }]);
      done();
    });
  });

  it('should return the reference data options', (done) => {
    component.control = {
      key: 'birthday',
      value: new CustomFormControl({
        name: 'test',
        type: FormNodeTypes.CONTROL,
        referenceData: ReferenceDataResourceType.CountryOfRegistration
      })
    };
    service.getAll$ = jest.fn().mockReturnValue(of([{ resourceKey: '1', description: 'test' }]));
    component.form = new FormGroup({});
    component.options.subscribe((value) => {
      expect(value).toBeTruthy();
      expect(value).toEqual([{ value: '1', label: 'test' }]);
      done();
    });
  });
});
