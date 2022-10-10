import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsvWeight } from '@forms/templates/psv/psv-weight.template';
import { createMockPsv } from '@mocks/psv-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';
import { WeightsComponent } from './weights.component';

describe('WeightsComponent', () => {
  let component: WeightsComponent;
  let fixture: ComponentFixture<WeightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [WeightsComponent],
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
