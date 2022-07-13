import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Defect } from '@models/defect';
import { DefectAdditionalInformationLocation } from '@models/defectAdditionalInformationLocation';
import { SharedModule } from '@shared/shared.module';
import { createMock } from 'ts-auto-mock';
import { DefectComponent } from './defect.component';

describe('DefectComponent', () => {
  let component: DefectComponent;
  let fixture: ComponentFixture<DefectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, DynamicFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectComponent);
    component = fixture.componentInstance;
    component.defect = createMock<Defect>();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(DefectComponent.prototype.mapLocationText.name, () => {
    it.each([
      ['', createMock<DefectAdditionalInformationLocation>()],
      ['', createMock<DefectAdditionalInformationLocation>({ axleNumber: undefined })],
      ['axleNumber: 0', createMock<DefectAdditionalInformationLocation>({ axleNumber: 0 })],
      ['rowNumber: 2 / seatNumber: 55', createMock<DefectAdditionalInformationLocation>({ rowNumber: 2, axleNumber: undefined, seatNumber: 55 })],
      ['axleNumber: 4', createMock<DefectAdditionalInformationLocation>({ axleNumber: 4 })],
      ['lateral: centre / rowNumber: 4', createMock<DefectAdditionalInformationLocation>({ lateral: DefectAdditionalInformationLocation.LateralEnum.Centre, rowNumber: 4 })]
    ])('should return %s for %p', (expected: string, location: DefectAdditionalInformationLocation) => {
      expect(component.mapLocationText(location)).toBe(expected);
    });
  });
});
