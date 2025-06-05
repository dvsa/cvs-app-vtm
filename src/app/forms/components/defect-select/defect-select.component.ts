import { NgClass } from '@angular/common';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-case-declarations */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagComponent } from '@components/tag/tag.component';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
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

	defects: Defect[] = [];
	isEditing = false;
	selectedDefect?: Defect;
	selectedItem?: Item;
	selectedDeficiency?: Deficiency;
	vehicleType!: VehicleTypes;

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

	hasItems(defect: Defect): boolean {
		return defect.items && defect.items.length > 0;
	}

	hasDeficiencies(item: Item): boolean {
		return item.deficiencies && item.deficiencies.length > 0;
	}

	categoryColor(category: string): 'red' | 'orange' | 'yellow' | 'green' | 'blue' {
		return (<Record<string, 'red' | 'orange' | 'green' | 'yellow' | 'blue'>>{
			major: 'orange',
			minor: 'yellow',
			dangerous: 'red',
			advisory: 'blue',
		})[`${category}`];
	}

	sortDefectItems(items: Item[]) {
		return items.sort((a, b) => a.itemNumber - b.itemNumber);
	}

	handleSelect(selected?: Defect | Item | Deficiency, type?: Types): void {
		switch (type) {
			case Types.Defect:
				this.selectedDefect = selected as Defect;
				this.selectedItem = undefined;
				this.selectedDeficiency = undefined;
				break;
			case Types.Item:
				this.selectedItem = selected as Item;
				this.selectedDeficiency = undefined;
				break;
			case Types.Deficiency:
				this.selectedDeficiency = selected as Deficiency;
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
