import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TestType, TestTypeCategory, TestTypesTaxonomy } from '@api/test-types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { TestTypesService } from '@services/test-types/test-types.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test-type-select[template]',
  templateUrl: './test-type-select.component.html',
  styleUrls: ['./test-type-select.component.scss']
})
export class TestTypeSelectComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: any = {};
  @Output() formChange = new EventEmitter();

  edit = false;
  categories: Array<TestTypeCategory> = [];
  selected?: TestType | TestTypeCategory;
  form!: CustomFormGroup;
  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService, private testTypesService: TestTypesService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(e => this.formChange.emit(e));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.testTypesService.selectAllTestTypes$;
  }

  tackByFn(i: number, testType: TestType | TestTypeCategory) {
    testType.id;
  }

  handleCategory(category: TestType | TestTypeCategory, i: number) {
    this.categories.length = i;

    if (category.hasOwnProperty('nextTestTypesOrCategories')) {
      this.categories.push(category as TestTypeCategory);
    } else {
      this.selected = category;
      this.testTypeIdControl?.setValue(category.id);
      this.categories = [];
    }
  }

  hasNext(category: TestType | TestTypeCategory) {
    return category.hasOwnProperty('nextTestTypesOrCategories');
  }

  get testTypeIdControl(): FormControl | null {
    return this.form.get(['testTypes', '0', 'testTypeId']) as FormControl;
  }

  handleChange() {
    this.categories = [];
    this.edit = !this.edit;
  }

  isSelected(id: string) {
    return this.categories.map(t => t.id).includes(id);
  }
}
