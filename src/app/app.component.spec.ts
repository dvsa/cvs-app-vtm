import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalModule } from '@azure/msal-angular';
import { PageNotFoundComponent } from '@core/components/page-not-found/page-not-found.component';
import { GoogleAnalyticsServiceMock } from '@mocks/google-analytics-service.mock';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Observable, of } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { State, initialAppState } from './store';

describe('AppComponent', () => {
	const MockUserService = {
		getUserName$: jest.fn().mockReturnValue(new Observable()),
	};
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				AppComponent,
				MsalModule,
				RouterTestingModule,
				PageNotFoundComponent,
				AppRoutingModule,
				StoreModule.forRoot({}),
			],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: LoadingService, useValue: { showSpinner$: of(false) } },
				{ provide: UserService, useValue: MockUserService },
				PageNotFoundComponent,
				{ provide: GoogleTagManagerService, useClass: GoogleAnalyticsServiceMock },
				{ provide: AnalyticsService, useValue: { pushToDataLayer: jest.fn(), setUserId: jest.fn() } },
			],
		}).compileComponents();
		router = TestBed.inject(Router);
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		fixture.detectChanges();
		expect(app).toBeTruthy();
	});

	describe('router.initialNavigation', () => {
		it('should init at default page', () => {
			router.initialNavigation();
			expect(router.url).toBe('/');
		});
	});

	describe('router.navigateByUrl', () => {
		it('should navigate to search page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			void router.navigateByUrl('/search');

			expect(navigateSpy).toHaveBeenCalledWith('/search');
		});

		it('should navigate to create page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			void router.navigateByUrl('/create');

			expect(navigateSpy).toHaveBeenCalledWith('/create');
		});

		it('should navigate to create-batch page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			void router.navigateByUrl('/create-batch');

			expect(navigateSpy).toHaveBeenCalledWith('/create-batch');
		});

		it('should navigate to test-records/:systemNumber/test-result/:testResultId/:testNumber', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			const systemNumber = '123';
			const testResultId = '456';
			const testNumber = '789';

			void router.navigateByUrl(`test-records/${systemNumber}/test-result/${testResultId}/${testNumber}`);

			expect(navigateSpy).toHaveBeenCalledWith(
				`test-records/${systemNumber}/test-result/${testResultId}/${testNumber}`
			);
		});

		it('should navigate to tech-records/:systemNumber/:createdTimestamp', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			const systemNumber = '123';
			const createdTimestamp = '2024-02-23T09:56:12.872Z';

			void router.navigateByUrl(`tech-records/${systemNumber}/${createdTimestamp}`);

			expect(navigateSpy).toHaveBeenCalledWith(`tech-records/${systemNumber}/${createdTimestamp}`);
		});

		it('should navigate to reference-data page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			void router.navigateByUrl('/reference-data');

			expect(navigateSpy).toHaveBeenCalledWith('/reference-data');
		});

		it('should navigate to feature-toggle page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			void router.navigateByUrl('/feature-toggle');

			expect(navigateSpy).toHaveBeenCalledWith('/feature-toggle');
		});

		it('should navigate to error page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			void router.navigateByUrl('/error');

			expect(navigateSpy).toHaveBeenCalledWith('/error');
		});

		it('should navigate to PageNotFoundComponent page', () => {
			const navigateSpy = jest.spyOn(router, 'navigateByUrl');
			const invalidRoute = 'invalid-url';
			void router.navigateByUrl(invalidRoute);

			expect(navigateSpy).toHaveBeenCalledWith(invalidRoute);

			const currentComponent = TestBed.inject(PageNotFoundComponent);

			expect(currentComponent).toBeTruthy();
		});
	});
});
