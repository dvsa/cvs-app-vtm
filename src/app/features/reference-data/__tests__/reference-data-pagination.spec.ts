import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import {
	fetchReferenceDataAudit,
	fetchReferenceDataByKeySearch,
	initialReferenceDataState,
	referenceDataFeatureState,
} from '@store/reference-data';
import { of } from 'rxjs';
import { ReferenceDataAmendHistoryComponent } from '../reference-data-amend-history/reference-data-amend-history.component';
import { ReferenceDataDeletedListComponent } from '../reference-data-deleted-list/reference-data-deleted-list.component';

describe.each(['deleted list', 'amend history'] as const)('Reference data %s pagination', (view) => {
	let component: ReferenceDataDeletedListComponent | ReferenceDataAmendHistoryComponent;
	let fixture: ComponentFixture<ReferenceDataDeletedListComponent | ReferenceDataAmendHistoryComponent>;
	let store: MockStore;
	let loadReferenceDataByKey: ReturnType<typeof vi.fn>;
	let items: ReferenceDataModelBase[];
	const type = ReferenceDataResourceType.Brakes;
	const auditType = `${type}#AUDIT` as ReferenceDataResourceType;
	const columns = [{ name: 'description', heading: 'Description', order: 1 }];

	function referenceState(data: ReferenceDataModelBase[] | undefined) {
		return {
			...initialReferenceDataState,
			[auditType]: { ids: [], entities: {}, loading: false, searchReturn: data },
			[ReferenceDataResourceType.ReferenceDataAdminType]: {
				ids: [type],
				loading: false,
				entities: {
					[type]: {
						resourceKey: type,
						label: 'Brakes',
						columns,
					},
				},
			},
		};
	}

	beforeEach(() => {
		items = Array.from({ length: 35 }, (_, index) => ({
			resourceType: auditType,
			resourceKey: `B/12#${String(index).padStart(3, '0')}`,
			description: `Brake version ${index}`,
			reason: 'Duplicate code',
			createdName: `Examiner ${index}`,
			createdAt: '2026-11-09T12:00:00Z',
		}));
		loadReferenceDataByKey = vi.fn();
		const componentType =
			view === 'deleted list' ? ReferenceDataDeletedListComponent : ReferenceDataAmendHistoryComponent;
		TestBed.configureTestingModule({
			imports: [componentType],
			providers: [
				provideRouter([]),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ReferenceDataService, useValue: { loadReferenceDataByKey } },
				{ provide: UserService, useValue: { roles$: of(['ReferenceData.View']) } },
			],
		});
		store = TestBed.inject(MockStore);
		store.overrideSelector(referenceDataFeatureState, referenceState(items));
		vi.spyOn(TestBed.inject(ActivatedRoute), 'parent', 'get').mockReturnValue({
			params: of({ type }),
		} as ActivatedRoute);
		vi.spyOn(store, 'dispatch');
		fixture = TestBed.createComponent(componentType);
		component = fixture.componentInstance;
		if (view === 'amend history') {
			fixture.componentRef.setInput('type', type);
			fixture.componentRef.setInput('key', encodeURIComponent('B/12'));
			fixture.componentRef.setInput('title', 'Brake');
			fixture.componentRef.setInput('columns', columns);
		}
		fixture.detectChanges();
	});

	it('requests audit data using the route type and decoded resource key', () => {
		if (view === 'deleted list') {
			expect(loadReferenceDataByKey).toHaveBeenCalledExactlyOnceWith(
				ReferenceDataResourceType.ReferenceDataAdminType,
				type
			);
			expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(fetchReferenceDataAudit({ resourceType: auditType }));
		} else {
			expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(
				fetchReferenceDataByKeySearch({ resourceType: auditType, resourceKey: 'B/12#' })
			);
		}
		expect(component.numberOfRecords()).toBe(35);
	});

	it('shows the configured first page in descending audit-key order', () => {
		const perPage = view === 'deleted list' ? 25 : 5;
		const expectedKeys = Array.from({ length: perPage }, (_, index) => `B/12#${String(34 - index).padStart(3, '0')}`);
		expect(component.paginatedItems().map((item) => item.resourceKey)).toEqual(expectedKeys);
		expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(perPage);
		expect(fixture.nativeElement.querySelector('tbody tr').textContent).toContain('Brake version 34');
	});

	it('updates the displayed rows when pagination changes', () => {
		component.handlePaginationChange({ start: 25, end: 50 });
		fixture.detectChanges();
		expect(component.paginatedItems()).toHaveLength(10);
		expect(component.paginatedItems()[0].resourceKey).toBe('B/12#009');
		expect(component.paginatedItems().at(-1)?.resourceKey).toBe('B/12#000');
		expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(10);
	});

	it('keeps the current page when no pagination event is supplied', () => {
		component.handlePaginationChange({ start: 5, end: 10 });
		const page = component.paginatedItems();
		component.handlePaginationChange();
		expect(component.pageStart()).toBe(5);
		expect(component.pageEnd()).toBe(10);
		expect(component.paginatedItems()).toBe(page);
	});

	it.each([undefined, []])('handles missing or empty audit data (%s)', (data) => {
		store.overrideSelector(referenceDataFeatureState, referenceState(data));
		store.refreshState();
		fixture.detectChanges();
		expect(component.numberOfRecords()).toBe(0);
		expect(component.paginatedItems()).toEqual([]);
		expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(0);
	});

	it('returns an empty page when the requested range exceeds the available records', () => {
		component.handlePaginationChange({ start: 50, end: 75 });
		expect(component.paginatedItems()).toEqual([]);
	});
});
