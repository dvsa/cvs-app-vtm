import { UserService } from '@/src/app/services/user-service/user-service';
import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Modes } from '@models/modes.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { Observable, of } from 'rxjs';
import { BodySectionEditComponent } from '../body-section-edit/body-section-edit.component';
import { BodySectionSummaryComponent } from '../body-section-summary/body-section-summary.component';
import { BodySectionViewComponent } from '../body-section-view/body-section-view.component';
import { BodySectionComponent } from '../body-section.component';

describe('BodySectionComponent', () => {
	let component: BodySectionComponent;
	let fixture: ComponentFixture<BodySectionComponent>;
	const actions$: Observable<unknown> = of();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BodySectionComponent],
			providers: [
				ControlContainer,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: UserService, useValue: { roles$: of(['TechRecord.View']) } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(BodySectionComponent);
		fixture.componentRef.setInput('techRecord', createMockHgv(0) as V3TechRecordModel);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should render the view component in view mode', () => {
		fixture.componentRef.setInput('mode', Modes.VIEW);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(BodySectionViewComponent))).toBeTruthy();
	});

	it('should render the edit component in edit mode', () => {
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(BodySectionEditComponent))).toBeTruthy();
	});

	it('should render the summary component in summary mode', () => {
		fixture.componentRef.setInput('mode', Modes.SUMMARY);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(BodySectionSummaryComponent))).toBeTruthy();
	});

	it('should render nothing for an unhandled mode', () => {
		fixture.componentRef.setInput('mode', Modes.ABANDON);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(BodySectionViewComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(BodySectionEditComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(BodySectionSummaryComponent))).toBeFalsy();
	});
});
