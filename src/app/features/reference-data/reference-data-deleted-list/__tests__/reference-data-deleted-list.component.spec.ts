import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { ReferenceDataDeletedListComponent } from '../reference-data-deleted-list.component';
import { PaginationComponent } from '@components/pagination/pagination.component';

describe('DataTypeListComponent', () => {
	let component: ReferenceDataDeletedListComponent;
	let fixture: ComponentFixture<ReferenceDataDeletedListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ReferenceDataDeletedListComponent, RoleRequiredDirective, PaginationComponent],
			imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule],
			providers: [
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
