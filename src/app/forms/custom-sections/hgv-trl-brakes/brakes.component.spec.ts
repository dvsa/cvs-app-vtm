import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { HgvAndTrlBrakesComponent } from './brakes.component';

describe('BrakesComponent', () => {
  let component: HgvAndTrlBrakesComponent;
  let fixture: ComponentFixture<HgvAndTrlBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HgvAndTrlBrakesComponent ],
      imports: [ DynamicFormsModule ],
      providers: [provideMockStore({ initialState: initialAppState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HgvAndTrlBrakesComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = mockVehicleTechnicalRecord().techRecord.pop()!;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
