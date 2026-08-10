import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagComponent } from '@components/tag/tag.component';
import {
	DefectCategoryReferenceDataSchema,
	DefectDeficiencyReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { HighlightPipe } from '@pipes/highlight/highlight.pipe';
import { DefectsState, filteredDefects } from '@store/defects';
import { toEditOrNotToEdit } from '@store/test-records';
import { TestResultsState } from '@store/test-records/test-records.reducer';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
	selector: 'app-defect-select',
	templateUrl: './defect-select.component.html',
	styleUrls: ['./defect-select.component.scss'],
	imports: [TagComponent, FormsModule, HighlightPipe],
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
	searchFilter = '';
	searchTerm = '';

	private openDefects = new Set<number>();
	private openItems = new Set<string>();

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

	get isSearching(): boolean {
		return this.searchTerm.trim().length > 0;
	}

	search(): void {
		this.searchTerm = this.searchFilter;
	}

	onSearchInput(): void {
		if (!this.searchFilter.trim()) {
			this.searchTerm = '';
		}
	}

	get filteredTree(): DefectCategoryReferenceDataSchema[] {
		const term = this.searchTerm.trim().toLowerCase();
		if (!term) {
			return this.defects;
		}

		const result: DefectCategoryReferenceDataSchema[] = [];

		for (const defect of this.defects) {
			if (this.matches(defect.imDescription, term) || this.matches(defect.imNumber, term)) {
				result.push(defect);
				continue;
			}

			const items: DefectItemReferenceDataSchema[] = [];
			for (const item of defect.items ?? []) {
				if (this.matches(item.itemDescription, term) || this.matches(item.itemNumber, term)) {
					items.push(item);
					continue;
				}

				const deficiencies = (item.deficiencies ?? []).filter(
					(deficiency) =>
						this.matches(deficiency.deficiencyText, term) ||
						this.matches(deficiency.deficiencyId, term) ||
						this.matches(deficiency.ref, term)
				);

				if (deficiencies.length) {
					items.push({ ...item, deficiencies });
				}
			}

			if (items.length) {
				result.push({ ...defect, items });
			}
		}

		return result;
	}

	private matches(value: string | number | null | undefined, term: string): boolean {
		if (value === null || value === undefined) {
			return false;
		}
		return typeof value === 'number' ? value.toString() === term : value.toLowerCase().includes(term);
	}

	itemKey(defect: DefectCategoryReferenceDataSchema, item: DefectItemReferenceDataSchema): string {
		return `${defect.imNumber}.${item.itemNumber}`;
	}

	isDefectOpen(defect: DefectCategoryReferenceDataSchema): boolean {
		return this.openDefects.has(defect.imNumber);
	}

	toggleDefect(defect: DefectCategoryReferenceDataSchema): void {
		if (this.openDefects.has(defect.imNumber)) {
			this.openDefects.delete(defect.imNumber);
		} else {
			this.openDefects.add(defect.imNumber);
		}
	}

	isItemOpen(defect: DefectCategoryReferenceDataSchema, item: DefectItemReferenceDataSchema): boolean {
		return this.openItems.has(this.itemKey(defect, item));
	}

	toggleItem(defect: DefectCategoryReferenceDataSchema, item: DefectItemReferenceDataSchema): void {
		const key = this.itemKey(defect, item);
		if (this.openItems.has(key)) {
			this.openItems.delete(key);
		} else {
			this.openItems.add(key);
		}
	}

	selectDeficiency(deficiency: DefectDeficiencyReferenceDataSchema): void {
		this.handleSelect(deficiency, Types.Deficiency);
	}

	selectAdvisory(defect: DefectCategoryReferenceDataSchema, item: DefectItemReferenceDataSchema): void {
		this.selectedDefect = defect;
		this.selectedItem = item;
		this.handleSelect();
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

	deficiencyRefLabel(
		defect: DefectCategoryReferenceDataSchema,
		item: DefectItemReferenceDataSchema,
		deficiency: DefectDeficiencyReferenceDataSchema
	): string {
		const id = deficiency.deficiencyId ? `(${deficiency.deficiencyId})` : '';
		const subId = deficiency.deficiencySubId ? `(${deficiency.deficiencySubId})` : '';
		const star = deficiency.stdForProhibition ? '*' : '';
		return `${defect.imNumber}.${item.itemNumber} ${id}${subId}${star}`;
	}

	sortDefectItems(items: DefectItemReferenceDataSchema[]) {
		return [...items].sort((a, b) => (a.itemNumber ?? 0) - (b.itemNumber ?? 0));
	}

	sortDeficiencyItems(items: DefectDeficiencyReferenceDataSchema[]) {
		return [...items].sort((a, b) => this.getDeficiencyId(a).localeCompare(this.getDeficiencyId(b)));
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
