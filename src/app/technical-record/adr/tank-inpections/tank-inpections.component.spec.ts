import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TankDetails, Tank } from '@app/models/Tank';
import { AdrDetails } from '@app/models/adr-details';
import { TankInpectionsComponent } from './tank-inpections.component';

describe('TankInpectionsComponent', () => {
  let component: TestTankInpectionsComponent;
  let fixture: ComponentFixture<TestTankInpectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        TankInpectionsComponent,
        TestTankInpectionsComponent,
        TestTankInspectionsEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTankInpectionsComponent);
    component = fixture.componentInstance;
    const tank = {
      ...TESTING_UTILS.mockTank(),
      tankDetails: { tc2Details: TESTING_UTILS.mockTc2Details() } as TankDetails
    } as Tank;

    component.adrDetails = TESTING_UTILS.mockAdrDetails({
      tank: tank
    });
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
  selector: 'test-vtm-tank-inpections',
  template: `
    <vtm-tank-inpections [edit]="edit" [adrDetails]="adrDetails"></vtm-tank-inpections>
  `
})
class TestTankInpectionsComponent {
  edit: boolean;
  adrDetails: AdrDetails;
}

@Component({
  selector: 'vtm-tank-inspections-edit',
  template: `
    <div>{{ tankDetailsData | json }}</div>
  `
})
class TestTankInspectionsEditComponent {
  @Input() tankDetailsData: TankDetails;
}
