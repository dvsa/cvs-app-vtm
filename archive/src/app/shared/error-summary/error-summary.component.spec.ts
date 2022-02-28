import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { ErrorSummaryComponent } from './error-summary.component';
import { MockStore } from '@app/utils/';

describe('ErrorSummaryComponent', () => {
  let component: ErrorSummaryComponent;
  let fixture: ComponentFixture<ErrorSummaryComponent>;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorSummaryComponent],
      providers: [
        {
          provide: Store,
          useValue: store
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorSummaryComponent);
    component = fixture.componentInstance;
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component template with available error(s)', () => {
    mockSelector.next({
      getErrors: ['Available Error1', 'Available Error2']
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
