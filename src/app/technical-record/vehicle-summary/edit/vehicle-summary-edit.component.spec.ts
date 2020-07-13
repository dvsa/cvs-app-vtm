import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { of } from 'rxjs';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleSummaryEditComponent } from './vehicle-summary-edit.component';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { VIEW_STATE } from '@app/app.enums';

describe('VehicleSummaryEditComponent', () => {
  let component: VehicleSummaryEditComponent;
  let fixture: ComponentFixture<VehicleSummaryEditComponent>;
  let techRecHelper: TechRecordHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [VehicleSummaryEditComponent, TestTypeApprovalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TechRecordHelperService,
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
    techRecHelper = TestBed.get(TechRecordHelperService);
    fixture = TestBed.createComponent(VehicleSummaryEditComponent);
    component = fixture.componentInstance;
    component.viewState = VIEW_STATE.EDIT;
    component.techRecord = {
      approvalType: 'approval',
      regnDate: '2020-06-08',
      manufactureYear: 2003,
      euVehicleCategory: '3',
      departmentalVehicleMarker: true,
      vehicleClass: { code: '2', description: 'motorbikes over 200cc' }
    } as TechRecord;
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render axle parking brakes controls on initialization', () => {
    component.techRecord = {
      noOfAxles: 2,
      axles: [
        TESTING_UTILS.mockAxle(),
        TESTING_UTILS.mockAxle({ parkingBrakeMrk: false, axleNumber: 2 })
      ]
    } as TechRecord;
    fixture.detectChanges();

    expect(component.techRecordFg.get('noOfAxles').value).toBe(2);
    expect(component.axles.length).toBe(2);
    expect(component.axles.controls[1].get('name').value).toEqual('Axle 2');
    expect(component.axles.controls[0].get('selected').value).toBeTruthy();
    expect(component.axles.controls[0].get('axleNumber').value).toBe(1);
  });

  describe('handleFormChanges', () => {
    it('should call setNumberOfAxles on techRecHelper for "noOfAxles" changed', fakeAsync(() => {
      spyOn(techRecHelper, 'setNumberOfAxles');
      fixture.detectChanges();

      const noOfAxlesElement: HTMLSelectElement = fixture.debugElement.query(
        By.css('[id="test-edit-noOfAxles"]')
      ).nativeElement;
      const selectedNumber = noOfAxlesElement.options[4].value;
      noOfAxlesElement.value = selectedNumber;
      noOfAxlesElement.dispatchEvent(new Event('change'));
      tick(500);

      const result = +selectedNumber.split(':')[1].trim();
      expect(techRecHelper.setNumberOfAxles).toHaveBeenCalledWith(result);
    }));

    it('should render increased axle parking brakes controls by the number of axles', () => {
      const noOfAxles = 4;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxles));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxles);
      expect(component.axles.length).toBe(noOfAxles);
    });

    it('should render decreased axle parking brakes controls by the number of axles', () => {
      component.techRecord = {
        noOfAxles: 4,
        axles: [
          TESTING_UTILS.mockAxle(),
          TESTING_UTILS.mockAxle({ parkingBrakeMrk: false, axleNumber: 2 }),
          TESTING_UTILS.mockAxle({ parkingBrakeMrk: true, axleNumber: 3 }),
          TESTING_UTILS.mockAxle({ parkingBrakeMrk: false, axleNumber: 4 })
        ]
      } as TechRecord;

      const noOfAxlesToDecreaseBy = 2;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxlesToDecreaseBy));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxlesToDecreaseBy);
      expect(component.axles.length).toBe(noOfAxlesToDecreaseBy);
    });
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
