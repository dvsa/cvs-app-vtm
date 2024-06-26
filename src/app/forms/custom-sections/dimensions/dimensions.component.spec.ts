import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { WarningsEnum } from '@shared/enums/warnings.enum';
import { DimensionsComponent } from './dimensions.component';

describe('DimensionsComponent', () => {
  let component: DimensionsComponent;
  let fixture: ComponentFixture<DimensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DimensionsComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionsComponent);
    component = fixture.componentInstance;
    component.techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'hgv'>;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialiseWarnings', () => {
    beforeEach(() => {
      // eslint-disable-next-line no-restricted-syntax
      component.techRecord = mockVehicleTechnicalRecord('hgv');
      component.ngOnInit();
    });
    it('should populate the meta.warning property on the length control if value > 12000', () => {
      const control: CustomFormControl = component.form.get('techRecord_dimensions_length') as unknown as CustomFormControl;
      control.patchValue(12001);
      component.initialiseWarnings();
      expect(control.meta.warning).toBe(WarningsEnum.DIMENSIONS_LENGTH_WARNING);
    });
    it('should populate the meta.warning property on the width control if value > 2600', () => {
      const control: CustomFormControl = component.form.get('techRecord_dimensions_width') as unknown as CustomFormControl;
      control.patchValue(2601);
      component.initialiseWarnings();
      expect(control.meta.warning).toBe(WarningsEnum.DIMENSIONS_WIDTH_WARNING);
    });
  });
});
