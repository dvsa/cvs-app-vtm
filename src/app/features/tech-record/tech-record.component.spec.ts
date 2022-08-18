import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordComponent } from './tech-record.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerService } from '@core/components/spinner/spinner.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';

describe('TechRecordComponent', () => {
  let component: TechRecordComponent;
  let fixture: ComponentFixture<TechRecordComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TechRecordComponent],
      providers: [SpinnerService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectRouteNestedParams, { vin: '123456' });

    fixture = TestBed.createComponent(TechRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
