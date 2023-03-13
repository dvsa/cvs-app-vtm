import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomDefectComponent } from '../custom-defect/custom-defect.component';
import { CustomDefectsComponent } from './custom-defects.component';

describe('CustomDefectsComponent', () => {
  let component: CustomDefectsComponent;
  let fixture: ComponentFixture<CustomDefectsComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [CustomDefectsComponent, CustomDefectComponent],
      providers: [DynamicFormService, provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDefectsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct header', () => {
    expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Custom Defects');
  });

  describe('add and remove custom defects', () => {
    const template = <FormNode>{
      name: 'customDefectsSection',
      label: 'Custom Defects',
      type: 'group',
      children: [
        {
          name: 'testTypes',
          label: 'Test Types',
          type: 'array',
          children: [
            {
              name: '0',
              type: 'group',
              children: [
                {
                  name: 'customDefects',
                  type: 'array',
                  children: [
                    {
                      name: '0',
                      type: 'group',
                      children: [
                        {
                          name: 'referenceNumber',
                          label: 'Reference Number',
                          type: 'control'
                        },
                        {
                          name: 'defectName',
                          label: 'Defect Name',
                          type: 'control'
                        },
                        {
                          name: 'defectNotes',
                          label: 'Defect Notes',
                          type: 'control'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const data = {
      testTypes: [
        {
          customDefects: []
        }
      ]
    };

    it('should add new custom defect', inject([DynamicFormService], (dfs: DynamicFormService) => {
      component.form = dfs.createForm(template, data) as CustomFormGroup;
      expect(component.defectCount).toBe(0);
      component.handleAddCustomDefect();
      expect(component.defectCount).toBe(1);
    }));

    it('should remove custom defect', inject([DynamicFormService], (dfs: DynamicFormService) => {
      component.form = dfs.createForm(template, data) as CustomFormGroup;
      component.handleAddCustomDefect();
      expect(component.defectCount).toBe(1);
      component.handleRemoveDefect(0);
      expect(component.defectCount).toBe(0);
    }));
  });
});
