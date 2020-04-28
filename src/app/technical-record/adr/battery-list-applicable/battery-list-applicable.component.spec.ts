import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdrDetails } from '@app/models/adr-details';
import { BatteryListApplicableComponent } from './battery-list-applicable.component';

describe('BatteryListApplicableComponent', () => {
  let component: BatteryListApplicableComponent;
  let fixture: ComponentFixture<BatteryListApplicableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [BatteryListApplicableComponent, TestBatteryListApplicableEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryListApplicableComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.edit = false;
    component.adrDetails = TESTING_UTILS.mockAdrDetails();
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    component.adrDetails = {
      listStatementApplicable: false,
      batteryListNumber: 'refref2'
    } as AdrDetails;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-battery-list-applicable-edit',
  template: `
    <div>{{ adrDetails | json }}</div>
  `
})
class TestBatteryListApplicableEditComponent {
  @Input() adrDetails: AdrDetails;
}
