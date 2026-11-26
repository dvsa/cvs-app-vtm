import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import {
	DefectGETRequiredStandards,
	RequiredStandard,
	RequiredStandardTaxonomySection,
} from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Roles } from '@models/roles.enum';
import { HttpService } from '@services/http/http.service';
import { Subscription, combineLatest } from 'rxjs';

type Mode =
	| 'sections'
	| 'section-create'
	| 'section-amend'
	| 'section-delete'
	| 'sections-deleted'
	| 'standards'
	| 'standard-create'
	| 'standard-amend'
	| 'standard-delete'
	| 'standards-deleted';

export function mergeRequiredStandardSections(data: DefectGETRequiredStandards): RequiredStandardTaxonomySection[] {
	const sections: RequiredStandardTaxonomySection[] = [];
	for (const section of [...data.basic, ...data.normal]) {
		let target = sections.find(
			(item) => item.sectionNumber === section.sectionNumber && item.sectionDescription === section.sectionDescription
		);
		if (!target) {
			target = { ...section, requiredStandards: [] };
			sections.push(target);
		}
		for (const standard of section.requiredStandards) {
			if (
				!target.requiredStandards.some(
					(item) =>
						item.rsNumber === standard.rsNumber &&
						item.refCalculation === standard.refCalculation &&
						item.requiredStandard === standard.requiredStandard &&
						item.additionalInfo === standard.additionalInfo &&
						item.inspectionTypes.includes('basic') === standard.inspectionTypes.includes('basic') &&
						item.inspectionTypes.includes('normal') === standard.inspectionTypes.includes('normal')
				)
			)
				target.requiredStandards.push(standard);
		}
	}
	return sections.sort((current, next) =>
		current.sectionNumber.localeCompare(next.sectionNumber, 'en', { numeric: true })
	);
}

@Component({
	selector: 'app-required-standards-management',
	templateUrl: './required-standards-management.component.html',
	styleUrl: './required-standards-management.component.scss',
	imports: [
		ReactiveFormsModule,
		RouterLink,
		RoleRequiredDirective,
		ButtonComponent,
		ButtonGroupComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		GovukFormGroupCheckboxComponent,
	],
})
export class RequiredStandardsManagementComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly http = inject(HttpService);
	private readonly destroyRef = inject(DestroyRef);
	private readonly fb = inject(FormBuilder);
	private request?: Subscription;
	readonly roles = Roles;
	readonly mode: Mode = this.route.snapshot.data['mode'];
	readonly base = '/reference-data/required-standards';
	readonly categories = Object.values(EUVehicleCategory).map((value) => ({ value, label: value.toUpperCase() }));
	readonly selectedCategory = this.fb.control<string | null>(null);
	readonly search = this.fb.nonNullable.control('');
	readonly activeSearch = signal('');
	readonly sections = signal<RequiredStandardTaxonomySection[]>([]);
	readonly loading = signal(false);
	readonly error = signal('');
	readonly retryable = signal(false);
	readonly saveUnavailable = signal(false);
	readonly section = signal<RequiredStandardTaxonomySection | undefined>(undefined);
	readonly standard = signal<RequiredStandard | undefined>(undefined);
	category = '';
	sectionNumber = '';
	ref = '';

	readonly sectionForm = this.fb.group({
		euVehicleCategory: this.fb.control<string | null>(null),
		sectionNumber: this.fb.nonNullable.control(''),
		sectionDescription: this.fb.nonNullable.control(''),
	});
	readonly standardForm = this.fb.group({
		rsNumber: this.fb.nonNullable.control(''),
		requiredStandard: this.fb.nonNullable.control(''),
		refCalculation: this.fb.nonNullable.control(''),
		additionalInfo: this.fb.nonNullable.control(false),
		basicInspection: this.fb.nonNullable.control(false),
		normalInspection: this.fb.nonNullable.control(false),
	});

	constructor() {
		combineLatest([this.route.paramMap, this.route.queryParamMap])
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(([params, query]) => {
				this.request?.unsubscribe();
				this.loading.set(false);
				this.error.set('');
				this.retryable.set(false);
				this.category = params.get('category') ?? query.get('category') ?? '';
				this.sectionNumber = params.get('sectionNumber') ?? '';
				this.ref = params.get('ref') ?? '';
				this.selectedCategory.setValue(this.category || null, { emitEvent: false });
				if (this.mode === 'section-create') {
					if (this.category && !this.categories.some(({ value }) => value === this.category)) {
						this.error.set('The vehicle category is not recognised.');
						return;
					}
					this.sectionForm.controls.euVehicleCategory.setValue(this.category || null);
					return;
				}
				if (this.mode === 'sections-deleted' || this.mode === 'standards-deleted') return;
				if (!this.category) {
					if (this.mode !== 'sections') this.error.set('Select a vehicle category to view this record.');
					return;
				}
				if (!this.categories.some(({ value }) => value === this.category)) {
					this.error.set('The vehicle category is not recognised.');
					return;
				}
				this.load();
			});
	}

	load() {
		this.error.set('');
		this.retryable.set(false);
		this.sections.set([]);
		this.section.set(undefined);
		this.standard.set(undefined);
		this.loading.set(true);
		this.request?.unsubscribe();
		this.request = this.http
			.fetchRequiredStandards(this.category)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (data) => {
					this.loading.set(false);
					const sections = mergeRequiredStandardSections(data);
					this.sections.set(sections);
					if (!this.sectionNumber) return;
					const matches = sections.filter((item) => item.sectionNumber === this.sectionNumber);
					if (matches.length !== 1) {
						this.error.set(
							matches.length
								? 'This section number is ambiguous for the selected vehicle category.'
								: 'The section was not found in the available taxonomy.'
						);
						return;
					}
					const section = matches[0];
					this.section.set(section);
					this.sectionForm.setValue({
						euVehicleCategory: this.category,
						sectionNumber: section.sectionNumber,
						sectionDescription: section.sectionDescription,
					});
					if (!this.ref) return;
					const standards = section.requiredStandards.filter((item) => item.refCalculation === this.ref);
					if (standards.length !== 1) {
						this.error.set(
							standards.length
								? 'This reference is ambiguous within the section.'
								: 'The required standard was not found in the available taxonomy.'
						);
						return;
					}
					const standard = standards[0];
					this.standard.set(standard);
					this.standardForm.setValue({
						rsNumber: String(standard.rsNumber),
						requiredStandard: standard.requiredStandard,
						refCalculation: standard.refCalculation,
						additionalInfo: standard.additionalInfo,
						basicInspection: standard.inspectionTypes.includes('basic'),
						normalInspection: standard.inspectionTypes.includes('normal'),
					});
				},
				error: () => {
					this.loading.set(false);
					this.retryable.set(true);
					this.error.set('Required standards could not be loaded. Please try again.');
				},
			});
	}

	showCategory() {
		void this.router.navigate([this.base], { queryParams: { category: this.selectedCategory.value } });
	}

	filterSections() {
		const term = this.activeSearch().trim().toLowerCase();
		return this.sections().filter((section) =>
			`${section.sectionNumber} ${section.sectionDescription}`.toLowerCase().includes(term)
		);
	}

	filterStandards() {
		const term = this.activeSearch().trim().toLowerCase();
		return (this.section()?.requiredStandards ?? []).filter((item) =>
			`${item.rsNumber} ${item.requiredStandard} ${item.refCalculation}`.toLowerCase().includes(term)
		);
	}

	sectionUnique(number: string) {
		return this.sections().filter((section) => section.sectionNumber === number).length === 1;
	}

	standardUnique(ref: string) {
		return this.section()?.requiredStandards.filter((standard) => standard.refCalculation === ref).length === 1;
	}

	sectionLink(sectionNumber = this.sectionNumber) {
		return [this.base, this.category, sectionNumber];
	}
}
