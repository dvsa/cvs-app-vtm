import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestType, TestTypeCategory, TestTypesTaxonomy } from '@api/test-types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestTypesService } from '@services/test-types/test-types.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-type-select',
  templateUrl: './test-type-select.component.html',
  styleUrls: ['./test-type-select.component.scss']
})
export class TestTypeSelectComponent {
  @Input() isEditing = false;
  @Input() data?: TestResultModel;

  edit = false;
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

    if (category.hasOwnProperty('nextTestTypesOrCategories')) {
      this.categories.push(category as TestTypeCategory);
    } else {
      this.testTypesService.testTypeIdChanged(category.id);

      this.handleChange();
    }
  }

  hasNext(category: TestType | TestTypeCategory) {
    return category.hasOwnProperty('nextTestTypesOrCategories');
  }

  get testTypeId() {
    return this.data?.testTypes[0]?.testTypeId;
  }

  handleChange() {
    this.categories = [];
    this.edit = !this.edit;
  }

  isSelected(id: string) {
    return this.categories.map(t => t.id).includes(id);
  }
}
