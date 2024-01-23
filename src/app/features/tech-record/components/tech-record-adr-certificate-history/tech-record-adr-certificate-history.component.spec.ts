import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechRecordAdrCertificateHistoryComponent } from './tech-record-adr-certificate-history.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { createMockPsv } from '@mocks/psv-record.mock';

describe('TechRecordAdrCertificateHistoryComponent', () => {
  let component: TechRecordAdrCertificateHistoryComponent;
  let fixture: ComponentFixture<TechRecordAdrCertificateHistoryComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordAdrCertificateHistoryComponent],
      providers: [],
      imports: [],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordAdrCertificateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.currentTechRecord = createMockHgv(0);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('showTable', () => {
    it('should return true if the techRecord contains more than 1 certificate', () => {
    });
  });
});
