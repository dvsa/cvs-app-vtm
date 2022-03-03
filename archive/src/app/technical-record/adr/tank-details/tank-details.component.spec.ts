import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { Tank } from '@app/models/Tank';
import { TankDetailsComponent } from './tank-details.component';
import { AdrDetails } from '@app/models/adr-details';

describe('TankDetailsComponent', () => {
  let component: TestTankDetailsComponent;
  let fixture: ComponentFixture<TestTankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        TankDetailsComponent,
        TestTankDetailsComponent,
        TestTankDetailsEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTankDetailsComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails({ tank: TESTING_UTILS.mockTank() });
  });

  it('should create view only with populated data', () => {
    component.edit = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-tank-details',
  template: `
    <vtm-tank-details [edit]="edit" [adrDetails]="adrDetails"></vtm-tank-details>
  `
})
class TestTankDetailsComponent {
  edit: boolean;
  adrDetails: AdrDetails;
}

@Component({
  selector: 'vtm-tank-details-edit',
  template: `
    <div>{{ tank | json }}</div>
    <div>Selected vehicle: {{ vehicleType }}</div>
  `
})
class TestTankDetailsEditComponent {
  @Input() tank: Tank;
  @Input() vehicleType: string;
}
