import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestType } from '@models/test-types/testType';
import { TestTypeCategory } from '@models/test-types/testTypeCategory';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-test-type-select',
	templateUrl: './test-type-select.component.html',
	styleUrls: ['./test-type-select.component.scss'],
	imports: [NgClass, AsyncPipe],
})
export class TestTypeSelectComponent implements OnInit {
	testTypesService = inject(TestTypesService);
	technicalRecordService = inject(TechnicalRecordService);
	router = inject(Router);
	route = inject(ActivatedRoute);

	readonly testTypeSelected = output<TestType>();

	categories: Array<TestTypeCategory> = [];

	ngOnInit(): void {
		this.technicalRecordService.techRecordHistory$.subscribe((recordHistory) => {
			if (!recordHistory) {
				void this.router.navigate(['../../'], { relativeTo: this.route.parent });
			}
		});
	}

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
