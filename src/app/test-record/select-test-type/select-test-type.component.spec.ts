import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTestTypeComponent } from './select-test-type.component';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('SelectTestTypeComponent', () => {
  let component: SelectTestTypeComponent;
  let fixture: ComponentFixture<SelectTestTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTestTypeComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 'W01A34247' }),
            paramMap: of(convertToParamMap({ id: 'W01A34247' }))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
