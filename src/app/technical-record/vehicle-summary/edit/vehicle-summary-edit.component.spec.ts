import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleSummaryEditComponent } from './vehicle-summary-edit.component';

describe('VehicleSummaryEditComponent', () => {
  let component: VehicleSummaryEditComponent;
  let fixture: ComponentFixture<VehicleSummaryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [VehicleSummaryEditComponent, TestTypeApprovalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSummaryEditComponent);
    component = fixture.componentInstance;
    component.techRecord = TESTING_UTILS.mockTechRecord();
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-type-approval',
  template: `
    <div>Active record is: {{ techRecord | json }}</div>
  `
})
class TestTypeApprovalComponent {
  @Input() techRecord: TechRecord;
}
