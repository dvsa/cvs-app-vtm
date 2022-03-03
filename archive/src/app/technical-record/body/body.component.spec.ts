import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/';
import { IBody } from '@app/models/body-type';
import { BodyComponent } from './body.component';

describe('BodyComponent', () => {
  let component: BodyComponent;
  let fixture: ComponentFixture<BodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [BodyComponent, TestBodyEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BodyComponent);
    component = fixture.componentInstance;
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      make: 'Marc',
      functionCode: 'a',
      model: 'honda',
      conversionRefNo: 'x239f',
      bodyType: TESTING_UTILS.mockBodyType()
    });
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the edit components when editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-body-edit',
  template: `
    <div>BodyDetails is: {{ bodyDetails | json }}</div>
  `
})
class TestBodyEditComponent {
  @Input() bodyDetails: IBody;
}
