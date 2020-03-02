import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TyresComponent } from '@app/technical-record/tyres/tyres.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('TyresComponent', () => {
  let component: TyresComponent;
  let fixture: ComponentFixture<TyresComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [TyresComponent],
      providers: [TechRecordHelpersService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TyresComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = {
      vin: 'XMGDE02FS0H012345',
      vehicleSize: 'small',
      testStationName: 'Rowe, Wunsch and Wisoky',
      vehicleId: 'JY58FPP',
      vehicleType: 'psv',
      tyreUseCode: 'aaa',
      axles: [
        {
          parkingBrakeMrk: false,
          axleNumber: 1,
          tyres: {
            tyreCode: 'test',
            tyreSize: 'test',
            plyRating: 'test',
            fitmentCode: 'test',
            dataTrAxles: 'test'
          }
        },
        {
          parkingBrakeMrk: true,
          axleNumber: 2,
          tyres: {
            tyreCode: 'test',
            tyreSize: 'test',
            plyRating: 'test',
            fitmentCode: 'test',
            dataTrAxles: 'test'
          }
        },
        {
          parkingBrakeMrk: false,
          axleNumber: 3,
          tyres: {
            tyreCode: 'test',
            tyreSize: 'test',
            plyRating: 'test',
            fitmentCode: 'test',
            dataTrAxles: 'test'
          }
        }
      ]
    };

    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
