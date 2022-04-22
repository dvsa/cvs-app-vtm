import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormNodeTypes } from '../../services/dynamic-form.service';

import { DynamicFormGroupComponent } from './dynamic-form-group.component';

describe('DynamicFormGroupComponent', () => {
  let component: DynamicFormGroupComponent;
  let fixture: ComponentFixture<DynamicFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormGroupComponent]
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

  describe('populateData: ', () => {
    it('populate the form data - single item', () => {
      let template = { name: 'testname', children: [], type: FormNodeTypes.CONTROL, value: '' };
      component.populateData({ testname: 'new value' }, template);
      expect(template.value).toBe('new value');
    });

    it('populate the form data - children', () => {
      let template = { name: 'testname', children: [{ name: 'testchildname', children: [], type: FormNodeTypes.CONTROL, value: '' }], type: FormNodeTypes.CONTROL, value: '' };
      component.populateData({ testname: 'new value', testchildname: 'testchildname' }, template);
      expect(template.value).toBe('new value');
      expect(template.children[0].value).toBe('testchildname');
    });

    it('populate the form data - child objects', () => {
      let template = { name: 'innertestobj', children: [], type: FormNodeTypes.CONTROL, value: '' };
      component.populateData({ testobj: { innertestobj: 'innertestobj' } }, template);
      expect(template.value).toBe('innertestobj');
    });
  });
});
