import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AbstractControl, FormArray, ValidatorFn, Validators,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ValidatorNames } from '@forms/models/validators.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { DynamicFormService } from './dynamic-form.service';
import {
  CustomControl, CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes, FormNodeViewTypes,
} from './dynamic-form.types';

describe('DynamicFormService', () => {
  let service: DynamicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAppState })],
      imports: [RouterTestingModule, HttpClientTestingModule],
    });
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
      };

      expect(service.createForm(node)).toMatchObject({});
    });
    it('should return a FormGroup containing a single control', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'vin',
            label: 'Vehicle Identification Number',
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING,
          },
        ],
      };

      const outputGroup = service.createForm(node);
      const children = node.children as FormNode[];

      expect(
        (
          outputGroup.controls as {
            [key: string]: AbstractControl;
          }
        )[children[0].name],
      ).toBeTruthy();
    });

    it('should return a FormGroup mirroring the nested structure of the controls it was created with', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'sub-group',
            type: FormNodeTypes.GROUP,
            children: [
              {
                name: 'vin',
                label: 'Vehicle Identification Number',
                type: FormNodeTypes.CONTROL,
                viewType: FormNodeViewTypes.STRING,
              },
            ],
          },
        ],
      };

      const children = node.children as FormNode[];
      const grandChildren = children[0].children as FormNode[];

      const outputGroup = service.createForm(node);
      const subGroup = (
        outputGroup.controls as {
          [key: string]: AbstractControl;
        }
      )[children[0].name] as CustomFormGroup;

      expect(subGroup.controls[grandChildren[0].name]).toBeTruthy();
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
                label: 'Vehicle Identification Number',
                type: FormNodeTypes.CONTROL,
                viewType: FormNodeViewTypes.STRING,
              },
            ],
          },
        ],
      };

      const data = {
        vins: ['123', '456'],
      };

      const outputGroup = service.createForm(node, data);
      const formArray = outputGroup.get('vins');
      expect(formArray instanceof FormArray).toBeTruthy();
      expect((formArray as FormArray).controls).toHaveLength(2);
    });

    it('should return a formGroup with a nested FormArray with data given', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'axelsArray',
            type: FormNodeTypes.ARRAY,
            children: [
              {
                name: '0',
                type: FormNodeTypes.GROUP,
                children: [
                  {
                    name: 'vin',
                    label: 'Vehicle Identification Number',
                    type: FormNodeTypes.CONTROL,
                    viewType: FormNodeViewTypes.STRING,
                  },
                ],
              },
            ],
          },
        ],
      };

      const data = {
        axelsArray: [
          {
            vin: '12345',
          },
          {
            vin: '78910',
          },
        ],
      };

      const outputGroup = service.createForm(node, data);
      const formArray = outputGroup.get('axelsArray');
      const subGroup = (formArray as CustomFormArray).controls;

      expect(subGroup).toHaveLength(2);
    });

    it('should return a formGroup with a nested FormArray of simple controls', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'axelsArray',
            type: FormNodeTypes.ARRAY,
            children: [
              {
                name: 'vin',
                label: 'Vehicle Identification Number',
                type: FormNodeTypes.CONTROL,
                viewType: FormNodeViewTypes.STRING,
              },
            ],
          },
        ],
      };

      const data = { axelsArray: ['12345', '78910'] };

      const outputGroup = service.createForm(node, data);
      const formArray = outputGroup.get('axelsArray');
      const subGroup = (formArray as CustomFormArray).controls;

      expect(subGroup).toHaveLength(2);
    });

    it('should add correct validators', () => {
      const node: FormNode = {
        name: 'group',
        type: FormNodeTypes.GROUP,
        children: [
          <FormNode>{
            name: 'foo',
            type: FormNodeTypes.CONTROL,
            validators: [{ name: 'required' }],
          },
        ],
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
      const validators: Array<{ name: ValidatorNames; args?: any[] }> = [{ name: ValidatorNames.Required }];
      const expectedValidator: ValidatorFn = Validators.required;
      service.addValidators(control, validators);
      expect(control.hasValidator(expectedValidator)).toBeTruthy();
    });
  });

  describe('static validate functions', () => {
    it('should return a list of global errors for invalid controls', () => {
      const errors: GlobalError[] = [];
      const form = new CustomFormGroup(
        { name: 'group', type: FormNodeTypes.GROUP },
        {
          foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '', { validators: [Validators.required] }),
          bar: new CustomFormGroup(
            { name: 'innerGroup', type: FormNodeTypes.GROUP },
            {
              baz: new CustomFormControl({ name: 'baz', type: FormNodeTypes.CONTROL }, '', { validators: [Validators.required] }),
            },
          ),
        },
      );

      DynamicFormService.validate(form, errors);

      expect(errors).toHaveLength(2);
    });
  });
});
