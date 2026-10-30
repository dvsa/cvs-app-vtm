import { createMockTrl } from '@/src/mocks/trl-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Modes } from '@models/modes.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { AuthorisationIntoServiceSectionEditComponent } from '../authorisation-into-service-edit/authorisation-into-service-section-edit.component';
import { AuthorisationIntoServiceSectionComponent } from '../authorisation-into-service-section.component';
import { AuthorisationIntoServiceSectionSummaryComponent } from '../authorisation-into-service-summary/authorisation-into-service-section-summary.component';
import { AuthorisationIntoServiceSectionViewComponent } from '../authorisation-into-service-view/authorisation-into-service-section-view.component';

describe('AuthorisationIntoServiceSectionComponent', () => {
	let component: AuthorisationIntoServiceSectionComponent;
	let fixture: ComponentFixture<AuthorisationIntoServiceSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuthorisationIntoServiceSectionComponent],
			providers: [
				ControlContainer,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthorisationIntoServiceSectionComponent);
		fixture.componentRef.setInput('techRecord', createMockTrl(0) as V3TechRecordModel);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should render the view component in view mode', () => {
		fixture.componentRef.setInput('mode', Modes.VIEW);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AuthorisationIntoServiceSectionViewComponent))).toBeTruthy();
	});

	it('should render the edit component in edit mode', () => {
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AuthorisationIntoServiceSectionEditComponent))).toBeTruthy();
	});

	it('should render the summary component in summary mode', () => {
		fixture.componentRef.setInput('mode', Modes.SUMMARY);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AuthorisationIntoServiceSectionSummaryComponent))).toBeTruthy();
	});

	it('should render nothing for an unhandled mode', () => {
		fixture.componentRef.setInput('mode', Modes.ABANDON);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AuthorisationIntoServiceSectionViewComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(AuthorisationIntoServiceSectionEditComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(AuthorisationIntoServiceSectionSummaryComponent))).toBeFalsy();
	});
});
