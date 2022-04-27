import { TestBed } from '@angular/core/testing';
import { DynamicFormService, FormNode, FormNodeTypes, CustomFormControl, FormNodeViewTypes, CustomControl } from './dynamic-form.service';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

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
        type: FormNodeTypes.GROUP,
        children: []
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

      expect(outputGroup.controls[node.children[0].name]).toBeTruthy();
    });
  });

  describe('createForm', () => {
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
      const subGroup = outputGroup.controls[node.children[0].name] as FormGroup;

      expect(subGroup.controls[node.children[0].children[0].name]).toBeTruthy();
    });
  });

  describe('addValidators', () => {
    it('should add validators', () => {
      const control: CustomControl = new CustomFormControl({ name: 'testControl', type: FormNodeTypes.CONTROL, children: [] });
      const validators: Array<string> = ['required'];
      const expectedValidator: ValidatorFn = Validators.required;
      service.addValidators(control, validators);
      expect(control.hasValidator(expectedValidator)).toBeTruthy();
    });
  });
});
