import { Component, Injector, OnDestroy, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { SelectComponent } from '@forms/components/select/select.component';
import {
	ReferenceDataAdminType,
	ReferenceDataModelBase,
	ReferenceDataResourceType,
} from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import {
	selectAllReferenceDataByResourceType,
	selectRefDataBySearchTerm,
	selectReferenceDataByResourceKey,
} from '@store/reference-data';
import { Subject, catchError, filter, map, of, switchMap, take } from 'rxjs';

@Component({
	selector: 'app-reference-data-list',
	templateUrl: './reference-data-list.component.html',
	styleUrls: ['./reference-data-list.component.scss'],
	imports: [
		RoleRequiredDirective,
		FormsModule,
		ReactiveFormsModule,
		SelectComponent,
		ButtonGroupComponent,
		ButtonComponent,
		PaginationComponent,
		NoEmojisDirective,
	],
})
export class ReferenceDataListComponent implements OnInit, OnDestroy {
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store);
	globalErrorService = inject(GlobalErrorService);
	dfs = inject(DynamicFormService);
	titleService = inject(Title);

	type!: ReferenceDataResourceType;
	refDataAdminType!: Signal<ReferenceDataAdminType | undefined>;
	private readonly injector = inject(Injector);
	readonly disabled = signal(true);
	readonly pageStart = signal<number | undefined>(undefined);
	readonly pageEnd = signal<number | undefined>(undefined);
	// all items of the resource type; assigned in ngOnInit once the type is known from the route
	private allItems: Signal<Array<ReferenceDataModelBase> | undefined> = signal(undefined);
	// items matching the last search, or undefined when no search is applied
	private readonly searchResults = signal<Array<ReferenceDataModelBase> | undefined>(undefined);
	readonly data = computed(() => this.searchResults() ?? this.allItems());
	readonly paginatedItems = computed(() => this.data()?.slice(this.pageStart(), this.pageEnd()) ?? []);
	readonly numberOfRecords = computed(() => this.data()?.length ?? 0);
	private destroy$ = new Subject<void>();

	public form!: CustomFormGroup;
	public searchReturned = false;

	public searchTemplate: FormNode = {
		name: 'criteria',
		type: FormNodeTypes.GROUP,
		children: [
			{
				name: 'filter',
				label: 'Search filter',
				value: '',
				type: FormNodeTypes.CONTROL,
			},
			{
				name: 'term',
				value: '',
				type: FormNodeTypes.CONTROL,
			},
		],
	};

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.searchTemplate) as CustomFormGroup;
		this.route.params.pipe(take(1)).subscribe((params) => {
			this.type = params['type'];
			this.referenceDataService.loadReferenceData(this.type);
			this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
		});

		this.globalErrorService.errors$
			.pipe(
				take(1),
				filter((errors) => !errors.length),
				switchMap(() =>
					this.referenceDataService.fetchReferenceDataAudit(`${this.type}#AUDIT` as ReferenceDataResourceType).pipe(
						map((array) =>
							array.data.map((item) => {
								if (item.reason !== undefined) {
									this.disabled.set(false);
								}
							})
						)
					)
				),
				catchError((error) => {
					if (error.status === 404) {
						this.disabled.set(true);
						return of(true);
					}
					return of(false);
				})
			)
			.subscribe({
				next: (res) => of(!!res),
			});
		this.allItems = this.store.selectSignal(selectAllReferenceDataByResourceType(this.type));
		this.refDataAdminType = this.store.selectSignal(
			selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)
		) as Signal<ReferenceDataAdminType | undefined>;
		// the label arrives with the admin-type fetch, so keep the title reactive
		effect(
			() => {
				this.titleService.setTitle(`Search for ${this.refDataAdminType()?.label} - Vehicle Testing Management`);
			},
			{ injector: this.injector }
		);
	}

	public get roles(): typeof Roles {
		return Roles;
	}

	addNew(): void {
		void this.router.navigate(['create'], { relativeTo: this.route });
	}

	navigateToDeletedItems(): void {
		void this.router.navigate(['deleted-items'], { relativeTo: this.route });
	}

	amend(item: ReferenceDataModelBase): void {
		const key = encodeURIComponent(String(item.resourceKey));
		void this.router.navigate([key], { relativeTo: this.route });
	}

	delete(item: ReferenceDataModelBase): void {
		const key = encodeURIComponent(String(item.resourceKey));
		void this.router.navigate([`${key}/delete`], { relativeTo: this.route });
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart.set(event.start);
		this.pageEnd.set(event.end);
	}

	search(term: string, filterterm: keyof ReferenceDataModelBase) {
		this.globalErrorService.clearErrors();
		const trimmedTerm = term?.trim();
		if (!trimmedTerm || !filterterm) {
			const error = !trimmedTerm
				? { error: 'You must provide a search term', anchorLink: 'refSearch' }
				: { error: 'You must select a valid search filter', anchorLink: 'filter' };
			this.globalErrorService.addError(error);
			return;
		}

		this.store
			.pipe(select(selectRefDataBySearchTerm(trimmedTerm, this.type, filterterm)), take(1))
			.subscribe((items) => {
				if (!items?.length) {
					this.globalErrorService.addError({ error: 'Your search returned no results', anchorLink: 'refSearch' });
					this.searchResults.set([]);
				} else {
					this.searchResults.set(items);
					void this.router.navigate([`../${this.type}`], {
						relativeTo: this.route,
						queryParams: { 'reference-data-items-page': 1 },
					});
				}
				this.searchReturned = true;
			});
	}

	clear() {
		this.form.reset();
		this.globalErrorService.clearErrors();
		if (this.searchReturned) {
			this.searchResults.set(undefined);
			void this.router.navigate([`../${this.type}`], {
				relativeTo: this.route,
				queryParams: { 'reference-data-items-page': 1 },
			});
			this.searchReturned = false;
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
