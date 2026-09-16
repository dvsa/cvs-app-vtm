import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	DefectGETRequiredStandards,
	RequiredStandard,
	RequiredStandardTaxonomySection,
} from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { InspectionType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { RequiredStandardState } from '@store/required-standards/required-standards.reducer';
import { getRequiredStandardsState } from '@store/required-standards/required-standards.selector';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-required-standard-select',
	templateUrl: './required-standard-select.component.html',
	styleUrls: ['./required-standard-select.component.scss'],
	imports: [NgClass, DefaultNullOrEmpty],
})
export class RequiredStandardSelectComponent implements OnInit, OnDestroy {
	requiredStandardsStore = inject(Store<RequiredStandardState>);
	router = inject(Router);
	route = inject(ActivatedRoute);
	cdr = inject(ChangeDetectorRef);

	readonly requiredStandards = signal<RequiredStandardTaxonomySection[] | undefined>(undefined);
	readonly normalAndBasic = signal(false);
	isEditing = false;
	readonly selectedInspectionType = signal<InspectionType | undefined>(undefined);
	selectedSection?: RequiredStandardTaxonomySection;
	selectedRequiredStandard?: RequiredStandard;
	basicAndNormalRequiredStandards?: DefectGETRequiredStandards;

	onDestroy$ = new Subject();

	ngOnInit(): void {
		this.requiredStandardsStore
			.select(getRequiredStandardsState)
			.pipe(takeUntil(this.onDestroy$))
			.subscribe((requiredStandards) => {
				if (requiredStandards.basic.length) {
					this.normalAndBasic.set(true);
					this.requiredStandards.set([]);
					this.basicAndNormalRequiredStandards = requiredStandards;
				} else {
					this.normalAndBasic.set(false);
					this.requiredStandards.set(requiredStandards.normal);
					this.selectedInspectionType.set('normal');
					this.basicAndNormalRequiredStandards = undefined;
				}
			});
	}

	ngOnDestroy(): void {
		this.onDestroy$.next(true);
		this.onDestroy$.complete();
	}

	handleSelectBasicOrNormal(inspectionType: InspectionType): void {
		this.requiredStandards.set(
			inspectionType === 'basic'
				? this.basicAndNormalRequiredStandards?.basic
				: this.basicAndNormalRequiredStandards?.normal
		);
	}

	handleSelect(selected?: InspectionType | RequiredStandardTaxonomySection | RequiredStandard, type?: Types): void {
		switch (type) {
			case Types.InspectionType:
				this.handleSelectBasicOrNormal(selected as InspectionType);
				this.selectedInspectionType.set(selected as InspectionType);
				this.selectedSection = undefined;
				this.selectedRequiredStandard = undefined;
				break;
			case Types.Section:
				this.selectedSection = selected as RequiredStandardTaxonomySection;
				this.selectedRequiredStandard = undefined;
				break;
			case Types.RequiredStandard:
				this.selectedRequiredStandard = selected as RequiredStandard;
				if (this.selectedRequiredStandard) {
					void this.router.navigate(
						[`${this.selectedInspectionType()}/${this.selectedRequiredStandard.refCalculation}`],
						{
							relativeTo: this.route,
							queryParamsHandling: 'merge',
						}
					);
				}
				break;
			default:
				console.error('Unsupported:');
				break;
		}
	}

	get types(): typeof Types {
		return Types;
	}

	get inspectionTypes(): InspectionType[] {
		return ['basic', 'normal'];
	}
}

enum Types {
	InspectionType = 0,
	Section = 1,
	// eslint-disable-next-line @typescript-eslint/no-shadow
	RequiredStandard = 2,
}
