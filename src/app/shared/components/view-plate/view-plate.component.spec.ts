import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { Plates, TechRecordModel } from '@models/vehicle-tech-record.model';
import { ViewPlateComponent } from './view-plate.component';

describe('ViewPlateComponent', () => {
  let component: ViewPlateComponent;
  let fixture: ComponentFixture<ViewPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPlateComponent],
      imports: [HttpClientTestingModule],
      providers: [DocumentRetrievalService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchLatestPlate', () => {
    it('should fetch the plate if only 1 exists', () => {
      component.currentTechRecord = {
        plates: [
          {
            plateIssueDate: new Date(),
            plateSerialNumber: '123456',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          } as Plates
        ]
      } as TechRecordModel;

      const plateFetched = component.fetchLatestPlate();

      expect(plateFetched).toBeDefined();
      expect(plateFetched.plateSerialNumber).toEqual('123456');
    });

    it('should fetch the latest plate if more than 1 exists', () => {
      component.currentTechRecord = {
        plates: [
          {
            plateIssueDate: new Date(new Date().getTime()),
            plateSerialNumber: '123456',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          },
          {
            plateIssueDate: new Date(new Date().getTime() + 5),
            plateSerialNumber: '234567',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          },
          {
            plateIssueDate: new Date(new Date().getTime() - 5),
            plateSerialNumber: '345678',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          }
        ]
      } as TechRecordModel;

      const plateFetched = component.fetchLatestPlate();

      expect(plateFetched).toBeDefined();
      expect(plateFetched.plateSerialNumber).toEqual('234567');
    });

    it('should return null if plates are empty', () => {
      component.currentTechRecord = {
        plates: [] as Plates[]
      } as TechRecordModel;

      const plateFetched = component.fetchLatestPlate();

      expect(plateFetched).toBeNull();
    });
  });
});
