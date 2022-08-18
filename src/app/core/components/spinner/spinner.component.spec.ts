import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { getSpinner } from '@store/spinner/selectors/spinner.selectors';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinner: HTMLElement;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      providers: [SpinnerService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Default should not show
    spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
    expect(spinner).toBeNull();
  });

  it('should show', () => {
    store.overrideSelector(getSpinner, true);
    fixture.detectChanges();
    spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });

  it('should NOT show', () => {
    store.overrideSelector(getSpinner, false);
    fixture.detectChanges();
    spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
    expect(spinner).toBeNull();
  });
});
