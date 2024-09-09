import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@api/reference-data';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { ReferenceDataAmendHistoryComponent } from '../reference-data-amend-history.component';

describe('ReferenceDataAmendHistoryComponent', () => {
	let component: ReferenceDataAmendHistoryComponent;
	let fixture: ComponentFixture<ReferenceDataAmendHistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ReferenceDataAmendHistoryComponent],
			imports: [RouterTestingModule, HttpClientTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: {} },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReferenceDataAmendHistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('handlePaginationChange', () => {
		it('should set pageStart and pageEnd', () => {
			component.handlePaginationChange({ start: 7, end: 20 });

			expect(component.pageStart).toBe(7);
			expect(component.pageEnd).toBe(20);
		});
	});
});
