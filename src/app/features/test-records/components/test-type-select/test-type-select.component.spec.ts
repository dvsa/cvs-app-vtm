import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestType, TestTypeCategory } from '@api/test-types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { mockTestType, mockTestTypeCategory } from '@mocks/mock-test-types';
import { provideMockStore } from '@ngrx/store/testing';
import { TestTypesService } from '@services/test-types/test-types.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { TestTypeSelectComponent } from './test-type-select.component';

describe('TestTypeSelectComponent', () => {
  let component: TestTypeSelectComponent;
  let fixture: ComponentFixture<TestTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTypeSelectComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        DynamicFormService,
        provideMockStore({ initialState: initialAppState }),
        { provide: TestTypesService, useValue: { selectAllTestTypes$: of([]), testTypeIdChanged: () => {} } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return testType id', () => {
    expect(component.tackByFn(0, mockTestTypeCategory({ id: '1' }))).toBe('1');
  });

  it('should return true if prop nextTestTypesOrCategories exists', () => {
    expect(component.hasNext(mockTestTypeCategory({ nextTestTypesOrCategories: [] }))).toBeTruthy();
    expect(component.hasNext(mockTestType() as unknown as TestType | TestTypeCategory)).toBeFalsy();
  });

  it('should return true if category with given id exists in array', () => {
    component.categories = new Array(3).fill(0).map((_, id) => mockTestTypeCategory({ id: `${id + 1}` }));
    expect(component.isSelected('1')).toBeTruthy();
    expect(component.isSelected('4')).toBeFalsy();
  });

  describe('TestTypeSelectComponent.prototype.handleCategory.name', () => {
    it('should emit selected testType through testTypeSelected', (done) => {
      component.testTypeSelected.subscribe((val) => {
        expect(val.id).toBe('1');
        done();
      });
      component.categories = new Array(3).fill(0).map((_, id) => mockTestTypeCategory({ id: `${id + 1}` }));
      component.handleCategory(mockTestTypeCategory({ id: '1' }), 0);
    });

    it('should push a new category into categories', () => {
      component.categories = new Array(2).fill(0).map((_, id) => mockTestTypeCategory({ id: `${id + 1}` }));
      component.handleCategory(mockTestTypeCategory({ id: '3', nextTestTypesOrCategories: [] }), 2);
      expect(component.categories).toHaveLength(3);
    });

    it('should replace last category for given categories', () => {
      component.categories = new Array(2).fill(0).map((_, id) => mockTestTypeCategory({ id: `${id + 1}` }));
      component.handleCategory(mockTestTypeCategory({ id: '3', nextTestTypesOrCategories: [] }), 1);
      expect(component.categories).toHaveLength(2);
      expect(component.categories[1].id).toBe('3');
    });
  });
});
