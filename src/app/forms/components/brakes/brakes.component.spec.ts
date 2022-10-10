import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { BrakesComponent } from './brakes.component';

describe('BrakesComponent', () => {
  let component: BrakesComponent;
  let fixture: ComponentFixture<BrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrakesComponent ],
      imports: [ DynamicFormsModule ],
      providers: [provideMockStore({ initialState: initialAppState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrakesComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = mockVehicleTechnicalRecord().techRecord.pop()!;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
