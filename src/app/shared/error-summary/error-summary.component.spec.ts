import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ErrorSummaryComponent } from './error-summary.component';
import { getErrors } from '@app/store/selectors/error.selectors';

const mockSelector = new BehaviorSubject<any>(undefined);

class MockStore {
  select(selector: any) {
    switch (selector) {
      case getErrors:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getErrors') ? value['getErrors'] : []
          )
        );
      default:
        return mockSelector;
    }
  }

  dispatch(action: Action) {
    return [];
  }
}

describe('ErrorSummaryComponent', () => {
  let component: ErrorSummaryComponent;
  let fixture: ComponentFixture<ErrorSummaryComponent>;
  const store: MockStore = new MockStore();

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
