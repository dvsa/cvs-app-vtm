import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
