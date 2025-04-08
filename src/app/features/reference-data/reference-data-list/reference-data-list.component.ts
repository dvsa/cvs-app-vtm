import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
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
import { Observable, Subject, catchError, filter, map, of, switchMap, take } from 'rxjs';
import { ButtonGroupComponent } from '../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { RoleRequiredDirective } from '../../../directives/app-role-required/app-role-required.directive';
import { SelectComponent } from '../../../forms/components/select/select.component';

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
		AsyncPipe,
	],
})
export class ReferenceDataListComponent implements OnInit, OnDestroy {
	type!: ReferenceDataResourceType;
	disabled = true;
	pageStart?: number;
	pageEnd?: number;
	currentPage?: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: Observable<Array<any> | undefined>;
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

	constructor(
		private referenceDataService: ReferenceDataService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store,
		private cdr: ChangeDetectorRef,
		private globalErrorService: GlobalErrorService,
		public dfs: DynamicFormService
	) {}

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
									this.disabled = false;
								}
							})
						)
					)
				),
				catchError((error) => {
					if (error.status === 404) {
						this.disabled = true;
						return of(true);
					}
					return of(false);
				})
			)
			.subscribe({
				next: (res) => of(!!res),
			});
		this.data = this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)));
	}

	get refDataAdminType$(): Observable<ReferenceDataAdminType | undefined> {
		return this.store.pipe(
			select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type))
		);
	}

	public get roles(): typeof Roles {
		return Roles;
	}

	addNew(): void {
		void this.router.navigate(['create'], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}

	navigateToDeletedItems(): void {
		void this.router.navigate(['deleted-items'], { relativeTo: this.route });
	}

	amend(item: ReferenceDataModelBase): void {
		const key = encodeURIComponent(String(item.resourceKey));
		void this.router.navigate([key], { relativeTo: this.route }).then(() => {
			window.location.reload();
		});
	}

	delete(item: ReferenceDataModelBase): void {
		const key = encodeURIComponent(String(item.resourceKey));
		void this.router.navigate([`${key}/delete`], { relativeTo: this.route });
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}

	get paginatedItems$() {
		return (this.data ?? of([])).pipe(map((items) => items?.slice(this.pageStart, this.pageEnd) ?? []));
	}

	get numberOfRecords$() {
		return (this.data ?? of([])).pipe(map((items) => items?.length ?? 0));
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
					this.data = of([]);
				} else {
					this.data = of(items);
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
			this.data = this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)));
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
