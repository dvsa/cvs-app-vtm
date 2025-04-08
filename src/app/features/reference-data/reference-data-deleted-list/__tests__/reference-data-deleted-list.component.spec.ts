import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { ReferenceDataDeletedListComponent } from '../reference-data-deleted-list.component';

describe('DataTypeListComponent', () => {
	let component: ReferenceDataDeletedListComponent;
	let fixture: ComponentFixture<ReferenceDataDeletedListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReferenceDataDeletedListComponent, RoleRequiredDirective, PaginationComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.ReferenceDataView]),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReferenceDataDeletedListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
