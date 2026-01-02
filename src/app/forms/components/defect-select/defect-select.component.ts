import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagComponent } from '@components/tag/tag.component';
import {
	DefectCategoryReferenceDataSchema,
	DefectDeficiencyReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { DefectsState, filteredDefects } from '@store/defects';
import { toEditOrNotToEdit } from '@store/test-records';
import { TestResultsState } from '@store/test-records/test-records.reducer';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
	selector: 'app-defect-select',
	templateUrl: './defect-select.component.html',
	styleUrls: ['./defect-select.component.scss'],
	imports: [NgClass, TagComponent],
})
export class DefectSelectComponent implements OnInit, OnDestroy {
	testResultsStore = inject(Store<TestResultsState>);
	defectsStore = inject(Store<DefectsState>);
	router = inject(Router);
	route = inject(ActivatedRoute);

	defects: DefectCategoryReferenceDataSchema[] = [];
	isEditing = false;
	selectedDefect?: DefectCategoryReferenceDataSchema;
	selectedItem?: DefectItemReferenceDataSchema;
	selectedDeficiency?: DefectDeficiencyReferenceDataSchema;
	vehicleType!: VehicleType;

	onDestroy$ = new Subject();

	ngOnInit(): void {
		this.testResultsStore
			.select(toEditOrNotToEdit)
			.pipe(
				takeUntil(this.onDestroy$),
				filter((testResult) => !!testResult)
			)
			.subscribe((testResult) => {
				if (testResult) {
					this.vehicleType = testResult.vehicleType;
				}
			});

		this.defectsStore.select(filteredDefects(this.vehicleType)).subscribe((defectsTaxonomy) => {
			this.defects = defectsTaxonomy;
		});
	}

	ngOnDestroy(): void {
		this.onDestroy$.next(true);
		this.onDestroy$.complete();
	}

	get types(): typeof Types {
		return Types;
	}

	hasItems(defect: DefectCategoryReferenceDataSchema): boolean {
		return defect.items && defect.items.length > 0;
	}

	hasDeficiencies(item: DefectItemReferenceDataSchema): boolean {
		return item.deficiencies ? item.deficiencies.length > 0 : false;
	}

	categoryColor(category: string): 'red' | 'orange' | 'yellow' | 'green' | 'blue' {
		return (<Record<string, 'red' | 'orange' | 'green' | 'yellow' | 'blue'>>{
			major: 'orange',
			minor: 'yellow',
			dangerous: 'red',
			advisory: 'blue',
		})[`${category}`];
	}

	getDeficiencyId(deficiency: DefectDeficiencyReferenceDataSchema) {
		return `${deficiency.deficiencyId}(${deficiency.deficiencySubId ? deficiency.deficiencySubId : ''})`;
	}

	sortDefectItems(items: DefectItemReferenceDataSchema[]) {
		return items.sort((a, b) => (a.itemNumber ?? 0) - (b.itemNumber ?? 0));
	}

	sortDeficiencyItems(items: DefectDeficiencyReferenceDataSchema[]) {
		return items.sort((a, b) => this.getDeficiencyId(a).localeCompare(this.getDeficiencyId(b)));
	}

	handleSelect(
		selected?: DefectCategoryReferenceDataSchema | DefectItemReferenceDataSchema | DefectDeficiencyReferenceDataSchema,
		type?: Types
	): void {
		switch (type) {
			case Types.Defect:
				this.selectedDefect = selected as DefectCategoryReferenceDataSchema;
				this.selectedItem = undefined;
				this.selectedDeficiency = undefined;
				break;
			case Types.Item:
				this.selectedItem = selected as DefectItemReferenceDataSchema;
				this.selectedDeficiency = undefined;
				break;
			case Types.Deficiency:
				this.selectedDeficiency = selected as DefectDeficiencyReferenceDataSchema;
				void this.router.navigate([this.selectedDeficiency.ref], {
					relativeTo: this.route,
					queryParamsHandling: 'merge',
				});
				break;
			default:
				let advisoryRoute = `${this.selectedDefect?.imNumber}.${this.selectedItem?.itemNumber}.advisory`;
				if (this.selectedDefect?.imNumber === 71 && this.selectedItem?.itemNumber === 1) {
					advisoryRoute += this.selectedItem.itemDescription === 'All Roller Brake Test Machines:' ? '.0' : '.1';
				}

				void this.router.navigate([advisoryRoute], {
					relativeTo: this.route,
					queryParamsHandling: 'merge',
				});
				break;
		}
	}
}

enum Types {
	Defect = 0,
	Item = 1,
	Deficiency = 2,
}
