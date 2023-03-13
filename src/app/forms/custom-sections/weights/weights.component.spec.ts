import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockPsv } from '@mocks/psv-record.mock';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';
import { NumberInputComponent } from '../../components/number-input/number-input.component';
import { WeightsComponent } from './weights.component';

describe('WeightsComponent', () => {
  let component: WeightsComponent;
  let fixture: ComponentFixture<WeightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule, StoreModule.forRoot({}), HttpClientModule, RouterTestingModule],
      declarations: [NumberInputComponent, WeightsComponent],
      providers: [provideMockStore<State>({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = createMockPsv(12345).techRecord[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
