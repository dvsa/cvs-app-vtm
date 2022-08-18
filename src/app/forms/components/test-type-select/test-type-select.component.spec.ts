import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestType, TestTypeCategory } from '@api/test-types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { RequiredSection } from '@forms/templates/test-records/section-templates/required/required-hidden-section.template';
import { provideMockStore } from '@ngrx/store/testing';
import { TestTypesService } from '@services/test-types/test-types.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { createMock, createMockList } from 'ts-auto-mock';
import { TestTypeNamePipe } from './test-type-name.pipe';
import { TestTypeSelectComponent } from './test-type-select.component';

describe('TestTypeSelectComponent', () => {
  let component: TestTypeSelectComponent;
  let fixture: ComponentFixture<TestTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTypeSelectComponent, TestTypeNamePipe],
      providers: [
        DynamicFormService,
        provideMockStore({ initialState: initialAppState }),
        { provide: TestTypesService, useValue: { selectAllTestTypes$: of([]) } }
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTypeSelectComponent);
    component = fixture.componentInstance;
    component.template = RequiredSection;
    component.data = { testTypes: [{ testTypeId: '7' }] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return testType id', () => {
    expect(component.tackByFn(0, createMock<TestType>({ id: '1' }))).toBe('1');
  });

  it('should return true if prop nextTestTypesOrCategories exists', () => {
    expect(component.hasNext(createMock<TestTypeCategory>({ nextTestTypesOrCategories: [] }))).toBeTruthy();
    expect(component.hasNext(createMock<TestType>())).toBeFalsy();
  });

  it('should reset categories and toggle edit', () => {
    component.edit = true;
    component.categories = [createMock<TestTypeCategory>({ nextTestTypesOrCategories: [] })];
    component.handleChange();
    expect(component.categories.length).toBe(0);
    expect(component.edit).toBeFalsy();
  });

  it('should return true if category with given id exists in array', () => {
    component.categories = createMockList<TestTypeCategory>(3, id => createMock<TestTypeCategory>({ id: `${id + 1}` }));
    expect(component.isSelected('1')).toBeTruthy();
    expect(component.isSelected('4')).toBeFalsy();
  });

  describe(TestTypeSelectComponent.prototype.handleCategory.name, () => {
    it('should set testTypeId control value and reset categories', () => {
      component.categories = createMockList<TestTypeCategory>(3, id => createMock<TestTypeCategory>({ id: `${id + 1}` }));
      component.handleCategory(createMock<TestType>({ id: '1' }), 0);
      expect(component.testTypeIdControl?.value).toBe('1');
      expect(component.categories.length).toBe(0);
    });

    it('should push a new category into categories', () => {
      component.categories = createMockList<TestTypeCategory>(2, id => createMock<TestTypeCategory>({ id: `${id + 1}` }));
      component.handleCategory(createMock<TestTypeCategory>({ id: '3', nextTestTypesOrCategories: [] }), 2);
      expect(component.categories.length).toBe(3);
    });

    it('should replace last category for given categories', () => {
      component.categories = createMockList<TestTypeCategory>(2, id => createMock<TestTypeCategory>({ id: `${id + 1}` }));
      component.handleCategory(createMock<TestTypeCategory>({ id: '3', nextTestTypesOrCategories: [] }), 1);
      expect(component.categories.length).toBe(2);
      expect(component.categories[1].id).toBe('3');
    });
  });
});
