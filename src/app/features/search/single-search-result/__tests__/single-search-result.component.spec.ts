import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { SingleSearchResultComponent } from '../single-search-result.component';

describe('SingleSearchResultComponent', () => {
	let component: SingleSearchResultComponent;
	let fixture: ComponentFixture<SingleSearchResultComponent>;
	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SingleSearchResultComponent, RoleRequiredDirective],
			imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{
					provide: UserService,
					useValue: {
						roles$: of(['TechRecord.View']),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SingleSearchResultComponent);
		component = fixture.componentInstance;
		component.searchResult = {
			systemNumber: '123',
			createdTimestamp: '123',
			vin: '76890',
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: 'current',
			techRecord_manufactureYear: 1998,
		};
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});
});
