import { Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { IAppState } from '@app/store/state/app.state';
import { Store, INITIAL_STATE } from '@ngrx/store';
import { ErrorSummaryComponent } from './error-summary.component';
import { hot } from 'jasmine-marbles';

describe('ErrorSummaryComponent', () => {
  let component: ErrorSummaryComponent;
  let fixture: ComponentFixture<ErrorSummaryComponent>;
  let store: Store<IAppState>;
  let injector: Injector;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorSummaryComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorSummaryComponent);
    injector = getTestBed();
    store = TestBed.get(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
