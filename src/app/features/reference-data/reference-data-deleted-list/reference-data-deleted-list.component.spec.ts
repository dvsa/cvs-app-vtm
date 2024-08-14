import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-list.component';

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

		fixture = TestBed.createComponent(ReferenceDataDeletedListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
