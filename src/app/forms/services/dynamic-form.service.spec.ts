import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, ValidatorFn, Validators } from '@angular/forms';
import { DynamicFormService } from './dynamic-form.service';
import { CustomFormArray, CustomControl, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes, FormNodeViewTypes } from './dynamic-form.types';

describe('DynamicFormService', () => {
  let service: DynamicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createForm', () => {
    it('should return an empty FormGroup if the root node has no children', () => {
      const node: FormNode = {
        name: 'empty',
        type: FormNodeTypes.GROUP
      };

      expect(service.createForm(node)).toMatchObject({});
    });
  });

  describe('createForm', () => {
    it('should return a FormGroup containing a single control', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          <FormNode>{
            name: 'vin',
            label: 'Vechile Identification Number',
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
          }
        ]
      };

      const outputGroup = service.createForm(node);

      expect(
        (
          outputGroup.controls as {
            [key: string]: AbstractControl;
          }
        )[node.children![0].name]
      ).toBeTruthy();
    });

    it('should return a FormGroup mirroring the nested structure of the controls it was created with', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          <FormNode>{
            name: 'sub-group',
            type: FormNodeTypes.GROUP,
            children: [
              <FormNode>{
                name: 'vin',
                label: 'Vechile Identification Number',
                type: FormNodeTypes.CONTROL,
                viewType: FormNodeViewTypes.STRING
              }
            ]
          }
        ]
      };

      const outputGroup = service.createForm(node);
      const subGroup = (
        outputGroup.controls as {
          [key: string]: AbstractControl;
        }
      )[node.children![0].name] as CustomFormGroup;

      expect(subGroup.controls[node.children![0].children![0].name]).toBeTruthy();
    });

    it('should return a formGroup with a nested FormArray', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          <FormNode>{
            name: 'vins',
            type: FormNodeTypes.ARRAY,
            children: [
              <FormNode>{
                name: '0',
                label: 'Vechile Identification Number',
                type: FormNodeTypes.CONTROL,
                viewType: FormNodeViewTypes.STRING
              }
            ]
          }
        ]
      };

      const data = {
        vins: ['123', '456']
      };

      const outputGroup = service.createForm(node, data);
      const formArray = outputGroup.get('vins');
      expect(formArray instanceof FormArray).toBeTruthy();
      expect((formArray as FormArray).controls.length).toBe(2);
    });

    it('should return a formGroup with a nested FormArray with data given ', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          <FormNode>{
            name: 'axelsArray',
            type: FormNodeTypes.ARRAY,
            children: [
              <FormNode>{
                name: '0',
                type: FormNodeTypes.GROUP,
                children: [
                  <FormNode>{
                    name: 'vin',
                    label: 'Vechile Identification Number',
                    type: FormNodeTypes.CONTROL,
                    viewType: FormNodeViewTypes.STRING
                  }
                ]
              }
            ]
          }
        ]
      };

      let data = {
        axelsArray: [
          {
            vin: '12345'
          },
          {
            vin: '78910'
          }
        ]
      };

      const outputGroup = service.createForm(node, data);
      const formArray = outputGroup.get('axelsArray');
      const subGroup = (formArray as CustomFormArray).controls;

      expect(subGroup.length).toBe(2);
    });

    it('should add correct validators', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          <FormNode>{
            name: 'foo',
            type: FormNodeTypes.CONTROL,
            validators: [{ name: 'required' }]
          }
        ]
      };

      const outputGroup = service.createForm(node);
      const control = outputGroup.get('foo');
      expect(control instanceof CustomFormControl).toBeTruthy();
      expect(control?.hasValidator(Validators.required)).toBeTruthy();
    });
  });

  describe('addValidators', () => {
    it('should add validators', () => {
      const control: CustomControl = new CustomFormControl({ name: 'testControl', type: FormNodeTypes.CONTROL, children: [] });
      const validators: Array<{ name: string; args?: any[] }> = [{ name: 'required' }];
      const expectedValidator: ValidatorFn = Validators.required;
      service.addValidators(control, validators);
      expect(control.hasValidator(expectedValidator)).toBeTruthy();
    });
  });
});
