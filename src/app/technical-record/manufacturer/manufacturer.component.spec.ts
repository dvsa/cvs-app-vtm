import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { ManufacturerComponent } from './manufacturer.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord, ManufacturerDetails } from '@app/models/tech-record.model';

describe('ManufacturerComponent', () => {
  let fixture: ComponentFixture<TestManufacturerComponent>;
  let component: TestManufacturerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        ManufacturerComponent,
        TestManufacturerComponent,
        TestManufacturerEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestManufacturerComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      manufacturerDetails: TESTING_UTILS.mockManufacturer()
    } as TechRecord;
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
  selector: 'test-vtm-manufacturer',
  template: `
    <vtm-manufacturer [techRecord]="activeRecord" [editState]="editState"> </vtm-manufacturer>
  `
})
class TestManufacturerComponent {
  activeRecord: TechRecord;
  editState: boolean;
}

@Component({
  selector: 'vtm-manufacturer-edit',
  template: `
    <div>Manufacturer details is: {{ manufacturerEditDetails | json }}</div>
  `
})
class TestManufacturerEditComponent {
  @Input() manufacturerEditDetails: ManufacturerDetails;
}
