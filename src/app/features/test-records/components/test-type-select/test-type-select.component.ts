import { Component, EventEmitter, Output } from '@angular/core';
import { TestType, TestTypeCategory, TestTypesTaxonomy } from '@api/test-types';
import { TestTypesService } from '@services/test-types/test-types.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-type-select',
  templateUrl: './test-type-select.component.html',
  styleUrls: ['./test-type-select.component.scss'],
})
export class TestTypeSelectComponent {
  @Output() testTypeSelected = new EventEmitter<TestType>();

  categories: Array<TestTypeCategory> = [];

  constructor(private testTypesService: TestTypesService) {}

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.testTypesService.selectAllTestTypes$;
  }

  tackByFn(i: number, testType: TestType | TestTypeCategory) {
    return testType.id;
  }

  handleCategory(category: TestType | TestTypeCategory, i: number) {
    this.categories.length = i;

    if (Object.prototype.hasOwnProperty.call(category, 'nextTestTypesOrCategories')) {
      this.categories.push(category as TestTypeCategory);
    } else {
      this.testTypeSelected.emit(category);
    }
  }

  hasNext(category: TestType | TestTypeCategory) {
    return Object.prototype.hasOwnProperty.call(category, 'nextTestTypesOrCategories');
  }

  isSelected(id: string) {
    return this.categories.map((t) => t.id).includes(id);
  }
}
