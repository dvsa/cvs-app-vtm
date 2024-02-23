import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { AdrService } from '@services/adr/adr.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { AdrComponent } from './adr.component';

describe('AdrComponent', () => {
  let component: AdrComponent;
  let fixture: ComponentFixture<AdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        { provide: TechnicalRecordService, useValue: { updateEditingTechRecord: jest.fn() } },
        { provide: AdrService, useValue: { carriesDangerousGoods: jest.fn(), determineTankStatementSelect: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdrComponent);
    component = fixture.componentInstance;
    component.techRecord = createMockHgv(1234);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should populate the dangerous goods property', () => {
      const spy = jest.spyOn(component.adrService, 'carriesDangerousGoods');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handle form change', () => {
    it('the form should be updated', () => {
      const testData = { test: 11 };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const spy = jest.spyOn(component.form, 'patchValue');
      component.handleFormChange(testData);
      expect(spy).toHaveBeenCalled();
    });

    it('should not update the form if the event is null', () => {
      const testData = null as unknown as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const spy = jest.spyOn(component.form, 'patchValue');
      component.handleFormChange(testData);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not update the form if the techRecord is null', () => {
      component.techRecord = null as unknown as TechRecordType<'hgv' | 'lgv' | 'trl'>;
      const testData = { test: 11 };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const spy = jest.spyOn(component.form, 'patchValue');
      component.handleFormChange(testData);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
