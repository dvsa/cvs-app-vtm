import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { TyresComponent } from './tyres.component';
import { Axle, TechRecord } from '../../models/tech-record.model';

describe('TyresComponent', () => {
  let component: TyresComponent;
  let fixture: ComponentFixture<TyresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TyresComponent, TestTyresEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TyresComponent);
    component = fixture.componentInstance;
    const axles: Axle[] = [TESTING_UTILS.mockAxle()];
    component.activeRecord = TESTING_UTILS.mockTechRecord({ axles });
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create psv view only with populated data', () => {
    component.activeRecord.vehicleType = 'psv';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    component.activeRecord = {
      tyreUseCode: '4',
      axles: [TESTING_UTILS.mockAxle()]
    } as TechRecord;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-tyres-edit',
  template: `
    <div>active record is: {{ techRecord | json }}</div>
  `
})
class TestTyresEditComponent {
  @Input() techRecord: TechRecord;
}
