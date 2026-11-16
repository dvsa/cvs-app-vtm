import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Modes } from '@models/modes.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { AuditSectionSummaryComponent } from '../audit-section-summary/audit-section-summary.component';
import { AuditSectionViewComponent } from '../audit-section-view/audit-section-view.component';
import { AuditSectionComponent } from '../audit-section.component';

describe('AuditSectionComponent', () => {
	let component: AuditSectionComponent;
	let fixture: ComponentFixture<AuditSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuditSectionComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AuditSectionComponent);
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
		expect(fixture.debugElement.query(By.directive(AuditSectionViewComponent))).toBeTruthy();
		expect(fixture.debugElement.query(By.directive(AuditSectionSummaryComponent))).toBeFalsy();
	});

	it('should render the summary component in summary mode', () => {
		fixture.componentRef.setInput('mode', Modes.SUMMARY);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AuditSectionSummaryComponent))).toBeTruthy();
		expect(fixture.debugElement.query(By.directive(AuditSectionViewComponent))).toBeFalsy();
	});

	it('should render nothing for an unhandled mode', () => {
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AuditSectionViewComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(AuditSectionSummaryComponent))).toBeFalsy();
	});
});
