import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DynamicFormsModule } from '../../dynamic-forms.module';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { FormNodeTypes, FormNode } from '../../services/dynamic-form.types';
import { DynamicFormGroupComponent } from './dynamic-form-group.component';

describe('DynamicFormGroupComponent', () => {
  let component: DynamicFormGroupComponent;
  let fixture: ComponentFixture<DynamicFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([1, 0, 3])('trackByFn: should take and index and return it', (value) => {
    expect(component.trackByFn(value)).toBe(value);
  });

  it.each([
    [
      { a: 'b', c: 1 },
      [
        { key: 'a', value: 'b' },
        { key: 'c', value: 1 }
      ]
    ],
    [
      { name: 'test-name', label: 'test-label', type: 'test-type', children: [{ name: 'test-c-name', label: 'test-c-label', value: 'test-c-value', children: [], type: 'test-c-control', viewType: 'test-c-viewType' }] },
      [
        { key: 'name', value: 'test-name' },
        { key: 'label', value: 'test-label' },
        { key: 'type', value: 'test-type' },
        { key: 'children', value: [{ name: 'test-c-name', label: 'test-c-label', value: 'test-c-value', children: [], type: 'test-c-control', viewType: 'test-c-viewType' }] }
      ]
    ]
  ])('entriesOf: should split the keys out into values', (input: any, expected: any) => {
    expect(component.entriesOf(input)).toStrictEqual(expected);
  });

  describe('formNodeViewTypes', () => {
    it('should return FormNodeViewTypes enum', () => {
      Object.entries(FormNodeTypes).forEach((entry) => {
        expect(FormNodeTypes).toEqual(component.formNodeViewTypes);
        expect(component.formNodeViewTypes[entry[0] as keyof typeof FormNodeTypes]).toBe(entry[1]);
      });
    });
  });

  describe('template', () => {
    const template = () => {
      return <FormNode>{
        name: 'myForm',
        type: FormNodeTypes.GROUP,
        children: [
          { name: 'levelOneControl', type: FormNodeTypes.CONTROL, label: 'Level one control', value: 'some string' },
          {
            name: 'levelOneGroup',
            type: FormNodeTypes.GROUP,
            children: [
              { name: 'levelTwoControl', type: FormNodeTypes.CONTROL, label: 'Level two control', value: 'some string' },
              {
                name: 'levelTwoArray',
                type: FormNodeTypes.ARRAY,
                children: [
                  { name: 'levelTwoArrayControlOne', type: FormNodeTypes.CONTROL, value: '1' },
                  { name: 'levelTwoArrayControlTwo', type: FormNodeTypes.CONTROL, value: '2' }
                ]
              }
            ]
          }
        ]
      };
    };

    it('should generate the correct number of detail summary elements', inject([DynamicFormService], (dfs: DynamicFormService) => {
      component.form = dfs.createForm(template());

      fixture.detectChanges();

      const dtList = fixture.debugElement.queryAll(By.css('dt'));
      const ddList = fixture.debugElement.queryAll(By.css('dd'));

      expect(dtList.length).toBe(4);
      expect(ddList.length).toBe(4);
    }));

    it('should generate the correct number of input elements', inject([DynamicFormService], (dfs: DynamicFormService) => {
      component.isReadonly = false;
      component.form = dfs.createForm(template());

      fixture.detectChanges();

      const inputList = fixture.debugElement.queryAll(By.css('input'));

      expect(inputList.length).toBe(4);
    }));
  });
});
