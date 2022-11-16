import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@api/reference-data';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockPsv } from '@mocks/psv-record.mock';
import { Tyres } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';

import { TyresSearchComponent } from './tyres-search.component';

const mockReferenceDataService = {
  getTyreSearchReturn$: jest.fn()
  //getByKey$: jest.fn(),
  //loadReferenceData: jest.fn()
};

describe('TyresSearchComponent', () => {
  let component: TyresSearchComponent;
  let fixture: ComponentFixture<TyresSearchComponent>;
  // let spy: jest.SpyInstance<void, [tyre: Tyres, axleNumber: number]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TyresSearchComponent],
      imports: [
        //HttpClientTestingModule, RouterTestingModule,
        DynamicFormsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        GlobalErrorService,
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: ReferenceDataService, useValue: mockReferenceDataService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresSearchComponent);
    component = fixture.componentInstance;
    component.viewableTechRecord = createMockPsv(12345).techRecord[0];
    fixture.detectChanges();
    // spy = jest.spyOn(component, '');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('', () => {
    it('', () => {
      expect('').toBe('');
    });
    it('', () => {
      expect('').toBe('');
    });
  });

  describe('', () => {
    it('', () => {
      expect('').toBe('');
    });
    it('', () => {
      expect('').toBe('');
    });
  });
});
