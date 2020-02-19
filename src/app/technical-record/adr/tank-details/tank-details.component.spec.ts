import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { Tank } from '@app/models/Tank';
import { TankDetailsComponent } from './tank-details.component';

describe('TankDetailsComponent', () => {
  let component: TankDetailsComponent;
  let fixture: ComponentFixture<TankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TankDetailsComponent, TestTankDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankDetailsComponent);
    component = fixture.componentInstance;
    component.tank = TESTING_UTILS.mockTank();
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
  selector: 'vtm-tank-details-edit',
  template: `
    <div>{{ tank | json }}</div>
  `
})
class TestTankDetailsEditComponent {
  @Input() tank: Tank;
}
