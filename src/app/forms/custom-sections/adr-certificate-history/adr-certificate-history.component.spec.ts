import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdrCertificateHistoryComponent } from './adr-certificate-history.component';

describe('TechRecordAdrCertificateHistoryComponent', () => {
  let component: AdrCertificateHistoryComponent;
  let fixture: ComponentFixture<AdrCertificateHistoryComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrCertificateHistoryComponent],
      providers: [
        provideMockStore({ initialState: initialAppState }),
      ],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AdrCertificateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.currentTechRecord = createMockHgv(0);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('showTable', () => {
    it('should return false if isEditing returns true', () => {
      component.isEditing = true;
      expect(component.showTable()).toBe(false);
    });
    it('should return false if numberOfADRCertificates returns 0', () => {
      component.currentTechRecord = createMockHgv(0);
      component.isEditing = false;
      component.currentTechRecord.techRecord_adrPassCertificateDetails = [];
      expect(component.showTable()).toBe(false);
    });
    it('should return true if numberOfADRCertificates returns > 0', () => {
      component.currentTechRecord = createMockHgv(0);
      component.isEditing = false;
      component.currentTechRecord.techRecord_adrPassCertificateDetails = [
        {
          createdByName: '',
          certificateType: 'PASS',
          generatedTimestamp: '',
          certificateId: '',
        } as unknown as ADRCertificateDetails,
      ];
      expect(component.showTable()).toBe(true);
    });
  });
});
