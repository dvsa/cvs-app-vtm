import { TestBed } from '@angular/core/testing';
import { DynamicFormService, FormNode, FormNodeTypes, CustomFormControl } from './dynamic-form.service';
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
    it('should create a control', () => {
      const node: FormNode = {
        name: 'test',
        children: [],
        type: FormNodeTypes.CONTROL,
        value: 'This is the Value'
      };

      // const group: FormNode = {
      //   name: 'group',
      //   type: FormNodeTypes.GROUP,
      //   children: [node]
      // };

      // const { name, value } = node;

      // const expectedOutput: FormGroup = new FormGroup({});
      // const control = new CustomFormControl(node, value);
      // expectedOutput.addControl(name, control);

      // const output = service.createForm(group);
      expect(service.createForm(node)).toMatchObject(new FormGroup({}));
    });
  });

  describe('addValidators', () => {
    it('should add validators', () => {
      const control: FormControl = new FormControl({});
      const validators: Array<string> = ['required'];
      const expectedValidator: ValidatorFn = Validators.required;
      service.addValidators(control, validators);
      expect(control.hasValidator(expectedValidator)).toBeTruthy();
    });
  });
});
