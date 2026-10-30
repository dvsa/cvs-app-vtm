import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Modes } from '@models/modes.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { DDASectionEditComponent } from '../dda-section-edit/dda-section-edit.component';
import { DDASectionSummaryComponent } from '../dda-section-summary/dda-section-summary.component';
import { DDASectionViewComponent } from '../dda-section-view/dda-section-view.component';
import { DDASectionComponent } from '../dda-section.component';

describe('DDASectionComponent', () => {
	let component: DDASectionComponent;
	let fixture: ComponentFixture<DDASectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DDASectionComponent],
			providers: [
				ControlContainer,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DDASectionComponent);
		fixture.componentRef.setInput('techRecord', createMockHgv(0) as TechRecordType<'hgv'>);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should render the view component in view mode', () => {
		fixture.componentRef.setInput('mode', Modes.VIEW);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(DDASectionViewComponent))).toBeTruthy();
		expect(fixture.debugElement.query(By.directive(DDASectionEditComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(DDASectionSummaryComponent))).toBeFalsy();
	});

	it('should render the edit component in edit mode', () => {
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(DDASectionEditComponent))).toBeTruthy();
	});

	it('should render the summary component in summary mode', () => {
		fixture.componentRef.setInput('mode', Modes.SUMMARY);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(DDASectionSummaryComponent))).toBeTruthy();
	});

	it('should render nothing for an unhandled mode', () => {
		fixture.componentRef.setInput('mode', Modes.ABANDON);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(DDASectionViewComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(DDASectionEditComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(DDASectionSummaryComponent))).toBeFalsy();
	});
});
