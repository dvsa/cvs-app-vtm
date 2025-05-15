import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockStore } from '@ngrx/store/testing';
import { TechRecordAmendReasonComponent } from '../tech-record-amend-reason.component';

describe('TechRecordAmendReasonComponent', () => {
	let component: TechRecordAmendReasonComponent;
	let fixture: ComponentFixture<TechRecordAmendReasonComponent>;
	let route: ActivatedRoute;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechRecordAmendReasonComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([{ path: 'test-reason', component: jest.fn() }]),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordAmendReasonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('handleSubmit', () => {
		let errorsService: GlobalErrorService;

		beforeEach(() => {
			errorsService = TestBed.inject(GlobalErrorService);
		});

		it('should call handleSubmit', () => {
			const handleSubmitSpy = jest.spyOn(component, 'handleSubmit').mockImplementation();

			fixture.debugElement.query(By.css('#submit')).nativeElement.click();

			expect(handleSubmitSpy).toHaveBeenCalledTimes(1);
		});

		it('should clear errors when the form is valid', () => {
			component.form.get('reason')?.setValue('test-reason');

			const clearErrorsSpy = jest.spyOn(errorsService, 'clearErrors').mockImplementation();

			fixture.debugElement.query(By.css('#submit')).nativeElement.click();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should set errors when the form is invalid', () => {
			const setErrorsSpy = jest.spyOn(errorsService, 'setErrors').mockImplementation();

			fixture.debugElement.query(By.css('#submit')).nativeElement.click();

			expect(setErrorsSpy).toHaveBeenCalledTimes(1);
			expect(setErrorsSpy).toHaveBeenCalledWith([
				{ anchorLink: 'reasonForAmend', error: 'Reason for amending is required' },
			]);
		});

		it('should navigate when the form is valid and a reason is provided', () => {
			component.form.get('reason')?.setValue('test-reason');

			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

			fixture.debugElement.query(By.css('#submit')).nativeElement.click();

			expect(navigateSpy).toHaveBeenCalledTimes(1);
			expect(navigateSpy).toHaveBeenCalledWith(['../test-reason'], { relativeTo: route });
		});

		it('should not navigate when the form is invalid', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

			fixture.debugElement.query(By.css('#submit')).nativeElement.click();

			expect(navigateSpy).not.toHaveBeenCalled();
		});

		it('should not navigate when a reason is not provided', () => {
			component.form.removeControl('reason');

			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

			fixture.debugElement.query(By.css('#submit')).nativeElement.click();

			expect(navigateSpy).not.toHaveBeenCalled();
		});
	});
});
