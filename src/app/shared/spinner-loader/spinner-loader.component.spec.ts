import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { Store, StoreModule, INITIAL_STATE } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { SpinnerLoaderComponent } from './spinner-loader.component';

describe('SpinnerLoaderComponent', () => {
  let component: SpinnerLoaderComponent;
  let fixture: ComponentFixture<SpinnerLoaderComponent>;
  let injector: TestBed;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(appReducers)],
      declarations: [SpinnerLoaderComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerLoaderComponent);
    injector = getTestBed();
    store = injector.get(Store);
    spyOn(store, 'pipe').and.callThrough();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
