import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { RadioGroupComponent } from '@forms/components/radio-group/radio-group.component';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { ReferenceDataSelectTypeComponent } from '../reference-data-select-type.component';

describe('ReferenceDataComponent', () => {
	let component: ReferenceDataSelectTypeComponent;
	let fixture: ComponentFixture<ReferenceDataSelectTypeComponent>;
	let router: Router;
	let route: ActivatedRoute;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ReferenceDataSelectTypeComponent,
				RoleRequiredDirective,
				RadioGroupComponent,
				ButtonComponent,
				FormsModule,
			],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: { roles$: of([Roles.ReferenceDataView]) } },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReferenceDataSelectTypeComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		route = TestBed.inject(ActivatedRoute);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('cancel', () => {
		it('should navigate back relative to the route', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

			component.cancel();

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});
	});

	describe('navigateTo', () => {
		it('should navigate to the reference data resource type', () => {
			jest.spyOn(router, 'navigate').mockImplementation();
			jest.spyOn(component, 'isFormValid', 'get').mockReturnValueOnce(true);

			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

			component.navigateTo(ReferenceDataResourceType.CountryOfRegistration);

			expect(navigateSpy).toHaveBeenCalledWith(['COUNTRY_OF_REGISTRATION'], { relativeTo: route });
		});
	});

	describe('isFormValid', () => {
		it('checks the form is valid', () => {
			jest.spyOn(DynamicFormService, 'validate').mockReturnValueOnce();
			component.form.setValue({ referenceType: 'COUNTRY_OF_REGISTRATION' });
			expect(component.isFormValid).toBe(true);
		});
	});
});
