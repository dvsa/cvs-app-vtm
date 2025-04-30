import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { UserService } from '@services/user-service/user-service';
import { ReplaySubject, of } from 'rxjs';
import { HomeButtonComponent } from './components/home-button/home-button.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeComponent, HomeButtonComponent, RoleRequiredDirective],
			providers: [
				FormBuilder,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
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
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
