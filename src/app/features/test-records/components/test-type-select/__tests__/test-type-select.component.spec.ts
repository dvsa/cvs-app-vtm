import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { createMockTestTypeCategory } from '@mocks/test-type-category.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { TestTypeSelectComponent } from '../test-type-select.component';

describe('TestTypeSelectComponent', () => {
	let component: TestTypeSelectComponent;
	let fixture: ComponentFixture<TestTypeSelectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestTypeSelectComponent],
			providers: [
				DynamicFormService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
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
		expect(component.tackByFn(0, createMockTestTypeCategory({ id: '1' }))).toBe('1');
	});

	it('should return true if prop nextTestTypesOrCategories exists', () => {
		expect(component.hasNext(createMockTestTypeCategory({ nextTestTypesOrCategories: [] }))).toBeTruthy();
		expect(component.hasNext(createMockTestTypeCategory())).toBeFalsy();
	});

	it('should return true if category with given id exists in array', () => {
		component.categories = new Array(3).fill(0).map((id) => createMockTestTypeCategory({ id: `${id + 1}` }));
		expect(component.isSelected('1')).toBeTruthy();
		expect(component.isSelected('4')).toBeFalsy();
	});

	describe('TestTypeSelectComponent.prototype.handleCategory.name', () => {
		it('should emit selected testType through testTypeSelected', (done) => {
			component.testTypeSelected.subscribe((val) => {
				expect(val.id).toBe('1');
				done();
			});
			component.categories = new Array(3).fill(0).map((id) => createMockTestTypeCategory({ id: `${id + 1}` }));
			component.handleCategory(createMockTestTypeCategory({ id: '1' }), 0);
		});

		it('should push a new category into categories', () => {
			component.categories = new Array(2).fill(0).map((id) => createMockTestTypeCategory({ id: `${id + 1}` }));
			component.handleCategory(createMockTestTypeCategory({ id: '3', nextTestTypesOrCategories: [] }), 2);
			expect(component.categories).toHaveLength(3);
		});

		it('should replace last category for given categories', () => {
			component.categories = new Array(2).fill(0).map((id) => createMockTestTypeCategory({ id: `${id + 1}` }));
			component.handleCategory(createMockTestTypeCategory({ id: '3', nextTestTypesOrCategories: [] }), 1);
			expect(component.categories).toHaveLength(2);
			expect(component.categories[1].id).toBe('3');
		});
	});
});
