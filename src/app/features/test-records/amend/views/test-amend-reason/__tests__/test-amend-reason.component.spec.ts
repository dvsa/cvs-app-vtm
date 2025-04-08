import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';

import { TestAmendReasonComponent } from '../test-amend-reason.component';

describe('TestAmendReasonComponent', () => {
	let component: TestAmendReasonComponent;
	let fixture: ComponentFixture<TestAmendReasonComponent>;
	let router: Router;
	let route: ActivatedRoute;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestAmendReasonComponent, ReactiveFormsModule],
			providers: [provideRouter([])],
		}).compileComponents();

		router = TestBed.inject(Router);
		route = TestBed.inject(ActivatedRoute);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestAmendReasonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it.each([
		['incorrect-test-type', 1],
		['amend-test-details', 2],
	])('should navigate to %s on submit when reason is %n', (path, reason) => {
		const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
		component.form.setValue({ reason });
		component.handleSubmit();
		expect(navigateSpy).toHaveBeenCalledWith([path], { relativeTo: route });
	});
});
