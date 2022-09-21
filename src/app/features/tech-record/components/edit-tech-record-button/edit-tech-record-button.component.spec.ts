import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { EditTechRecordButtonComponent } from './edit-tech-record-button.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';

describe('EditTechRecordButtonComponent', () => {
  let component: EditTechRecordButtonComponent;
  let fixture: ComponentFixture<EditTechRecordButtonComponent>;
  let store: MockStore<State>;
  let techRecordsService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTechRecordButtonComponent ],
      providers:[provideMockStore({ initialState: initialAppState })],
      imports: [HttpClientTestingModule, DynamicFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTechRecordButtonComponent);
    store = TestBed.inject(MockStore);
    techRecordsService = TestBed.inject(TechnicalRecordService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT have edit button viewable if viewable tech record is archived', () => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'archived'}]}
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'archived'};

    const button = fixture.debugElement.query(By.css('#edit'))

    expect(button).toBeFalsy
    expect(component.isArchived).toBeTruthy
  })

  it('should have edit button viewable if viewable tech record is provisional', () => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'provisional'}]}
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'provisional'};

    const button = fixture.debugElement.query(By.css('#edit'))

    expect(button).toBeTruthy
    expect(component.isArchived).toBeFalsy
  })

  it('should have edit button viewable if viewable tech record is current AND provisional DOES NOT exist', () => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'current'}]}
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'current'};

    const button = fixture.debugElement.query(By.css('#edit'))

    expect(button).toBeTruthy
    expect(component.hasProvisional).toBeFalsy
  })

  it('should dispatch action to update and archive existing provisional record if viewable tech record is provisional', fakeAsync(() => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'provisional'}]}
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'provisional'};
    component.editableState = true;
    fixture.detectChanges();

    jest.spyOn(component, 'submitTechRecord')

    fixture.debugElement.query(By.css('#submit')).nativeElement.click()

    expect(component.submitTechRecord).toHaveBeenCalled();
  }))

  it('should dispatch action to create provisional if viewable tech record is current and no provisional exists', fakeAsync(() => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'current'}]}
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'current'};
    component.isCurrent = true;
    component.editableState = true;
    fixture.detectChanges();

    jest.spyOn(component, 'submitTechRecord')

    fixture.debugElement.query(By.css('#submit')).nativeElement.click()

    expect(component.submitTechRecord).toHaveBeenCalled();
  }))
});
