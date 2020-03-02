import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleComponent } from './vehicle.component';
import { TestResultModel } from '@app/models/test-result.model';
import { SharedModule } from '@app/shared/shared.module';
import { Component, Input } from '@angular/core';
import { Preparer } from '@app/models/preparer';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleComponent, TestVehicleEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    component.testRecord = component.testRecord = TESTING_TEST_MODELS_UTILS.mockTestRecord();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-vehicle-edit',
  template: `
    <div>{{ testRecord | json }}</div>
  `
})
class TestVehicleEditComponent {
  @Input() testRecord: TestResultModel;
  @Input() preparers: Preparer[];
  @Input() isSubmitted: boolean;
}
