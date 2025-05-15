import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { AmendVrmReasonComponent } from '../tech-record-amend-vrm-reason.component';

const mockDynamicFormService = {
	createForm: jest.fn(),
};

describe('TechRecordChangeVrmComponent', () => {
	const actions$ = new ReplaySubject<Action>();
	let component: AmendVrmReasonComponent;
	let errorService: GlobalErrorService;
	let fixture: ComponentFixture<AmendVrmReasonComponent>;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AmendVrmReasonComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]), snapshot: new ActivatedRouteSnapshot() } },
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				TechnicalRecordService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AmendVrmReasonComponent);
		errorService = TestBed.inject(GlobalErrorService);
		router = TestBed.inject(Router);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('errors', () => {
		it('should add an error when the reason for amending is not selected', () => {
			const addErrorSpy = jest.spyOn(errorService, 'setErrors');

			component.submit();

			expect(addErrorSpy).toHaveBeenCalledWith([
				{ error: 'Reason for change is required', anchorLink: 'is-cherished-transfer' },
			]);
		});
	});
	describe('submit', () => {
		it('should navigate to correct-error', () => {
			fixture.ngZone?.run(() => {
				const navigationSpy = jest.spyOn(router, 'navigate');
				component.form.controls['isCherishedTransfer'].setValue('correcting-error');
				component.submit();

				expect(navigationSpy).toHaveBeenCalledWith(['correcting-error'], { relativeTo: expect.anything() });
			});
		});
		it('should navigate to cherished-transfer', () => {
			fixture.ngZone?.run(() => {
				const navigationSpy = jest.spyOn(router, 'navigate');
				component.form.controls['isCherishedTransfer'].setValue('cherished-transfer');
				component.submit();

				expect(navigationSpy).toHaveBeenCalledWith(['cherished-transfer'], { relativeTo: expect.anything() });
			});
		});
	});
});
